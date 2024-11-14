export interface Root {
  took: number;
  timed_out: boolean;
  _shards: Shards;
  hits: Hits;
}

export interface Shards {
  total: number;
  successful: number;
  skipped: number;
  failed: number;
}

export interface Hits {
  total: Total;
  max_score: number | null;
  hits: Hit[];
}

export interface Total {
  value: number;
  relation: string;
}

export interface Hit {
  _index: string;
  _id: string;
  _score: number | null;
  _source: Source;
  sort: number[];
}

export interface Source {
  agent: Agent;
  manager: Manager;
  data: Data;
  rule: Rule;
  location: string;
  decoder: Decoder;
  timestamp: string;
}

export interface Agent {
  name: string;
  id: string;
}

export interface Manager {
  name: string;
}

export interface Data {
  win?: WindowsData;
  vulnerability?: VulnerabilityData;
  integration?: string;
  virustotal?: VirusTotalData;
}

export interface WindowsData {
  eventdata: WindowsEventData;
  system: WindowsSystemData;
}

export interface WindowsEventData {
  serviceType?: string;
  accountName?: string;
  imagePath?: string;
  startType?: string;
  serviceName?: string;
  subjectLogonId?: string;
  ipAddress?: string;
  authenticationPackageName?: string;
  workstationName?: string;
  subStatus?: string;
  logonProcessName?: string;
  targetUserName?: string;
  keyLength?: string;
  subjectUserSid?: string;
  processId?: string;
  ipPort?: string;
  failureReason?: string;
  targetDomainName?: string;
  targetUserSid?: string;
  logonType?: string;
  status?: string;
  data?: string;
  binary?: string;
}

export interface WindowsSystemData {
  eventID: string;
  keywords: string;
  level: string;
  channel: string;
  opcode: string;
  message: string;
  version: string;
  systemTime: string;
  eventRecordID: string;
  threadID: string;
  computer: string;
  task: string;
  processID: string;
  severityValue: string;
  providerName: string;
  eventSourceName?: string;
  providerGuid?: string;
}

export interface VulnerabilityData {
  severity: string;
  package: VulnerabilityPackage;
  assigner: string;
  cwe_reference?: string;
  published: string;
  title: string;
  type: string;
  rationale: string;
  reference: string;
  cve: string;
  enumeration: string;
  cvss: CvssData;
  updated: string;
  status: string;
}

export interface VulnerabilityPackage {
  condition: string;
  name: string;
  source: string;
  version: string;
  architecture: string;
}

export interface CvssData {
  cvss3?: Cvss3Data;
  cvss2?: Cvss2Data;
}

export interface Cvss3Data {
  base_score: string;
  vector: Cvss3Vector;
}

export interface Cvss3Vector {
  user_interaction: string;
  integrity_impact: string;
  scope: string;
  availability: string;
  confidentiality_impact: string;
  privileges_required: string;
  attack_vector?: string;
}

export interface Cvss2Data {
  base_score: string;
  vector: Cvss2Vector;
}

export interface Cvss2Vector {
  integrity_impact: string;
  availability: string;
  confidentiality_impact: string;
  access_complexity: string;
  authentication: string;
}

export interface VirusTotalData {
  sha1: string;
  malicious: string;
  total: string;
  found: string;
  positives: string;
  source: VirusTotalSource;
  permalink: string;
  scan_date: string;
}

export interface VirusTotalSource {
  sha1: string;
  file: string;
  alert_id: string;
  md5: string;
}

export interface Rule {
  level: number;
  description: string;
  groups: string[];
  id: string;
}

export interface Decoder {
  name: string;
}
