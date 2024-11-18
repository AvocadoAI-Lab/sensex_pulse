import type {Hit} from '@/types/wql';
import type {WindowsAnalysis} from '../types';

export const analyzeWindowsEvents = (alerts: Hit[]): WindowsAnalysis => {
  const eventTypes = new Map<string, number>();
  const criticalServices = new Map<string, number>();
  const authFailures = new Map<string, {
    count: number;
    lastAttempt: string;
    workstation?: string;
  }>();
  const processActivity = new Map<string, {
    count: number;
    paths: Set<string>;
  }>();

  alerts.forEach(alert => {
    const eventData = alert._source.data?.win?.eventdata;
    const system = alert._source.data?.win?.system;
    
    if (eventData) {
      // Track event types with system context
      if (system?.eventID) {
        const eventContext = `${system.eventID} - ${system.task || 'Unknown'}`;
        eventTypes.set(eventContext, (eventTypes.get(eventContext) || 0) + 1);
      }

      // Track service-related events with status
      if (eventData.serviceName) {
        const serviceContext = `${eventData.serviceName} (${eventData.status || 'modified'})`;
        criticalServices.set(
          serviceContext,
          (criticalServices.get(serviceContext) || 0) + 1
        );
      }

      // Enhanced authentication failure tracking
      if (eventData.targetUserName && eventData.subStatus) {
        const key = `${eventData.targetUserName}`;
        const current = authFailures.get(key) || {
          count: 0,
          lastAttempt: alert._source['@timestamp'],
          workstation: eventData.workstationName
        };
        current.count++;
        if (new Date(alert._source['@timestamp']) > new Date(current.lastAttempt)) {
          current.lastAttempt = alert._source['@timestamp'];
        }
        authFailures.set(key, current);
      }

      // Track process activity
      if (eventData.binary) {
        const procKey = eventData.binary.split('\\').pop() || eventData.binary;
        const current = processActivity.get(procKey) || {
          count: 0,
          paths: new Set<string>()
        };
        current.count++;
        current.paths.add(eventData.binary);
        processActivity.set(procKey, current);
      }
    }
  });

  return {
    eventTypes: Array.from(eventTypes.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5),
    criticalServices: Array.from(criticalServices.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5),
    authFailures: Array.from(authFailures.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5),
    suspiciousProcesses: Array.from(processActivity.entries())
      .filter(([, data]) => data.paths.size > 1 || data.count > 10)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5)
  };
};
