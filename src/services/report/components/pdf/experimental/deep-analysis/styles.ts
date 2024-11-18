import {StyleSheet} from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  summaryBox: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  summaryText: {
    fontSize: 12,
    fontFamily: 'Helvetica',
    color: '#1e293b',
    lineHeight: 1.5,
  },
  summaryHighlight: {
    fontFamily: 'Helvetica-Bold',
    color: '#2563eb',
  },
  systemCard: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  systemTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  systemDescription: {
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#64748b',
    lineHeight: 1.4,
    marginBottom: 12,
  },
  locationList: {
    gap: 8,
  },
  locationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#f8fafc',
    borderRadius: 4,
  },
  locationName: {
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#1e293b',
  },
  locationCount: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#2563eb',
  },
  technique: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#64748b',
  },
});
