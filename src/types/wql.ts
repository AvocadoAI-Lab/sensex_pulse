export interface Types3 {
    hits: Hits;
    _shards: Shards;
    timed_out: boolean;
    took: number;
}

export interface Hits {
    hits: Hit[];
    max_score: null | number;
    total: Total;
}

export interface Hit {
    _id: string;
    _index: string;
    _score: null | number;
    sort: number[];
    _source: Source;
}

// Rest of the file remains unchanged
export interface Source {
    agent: Agent;
    data?: Data;
    decoder: Decoder;
    full_log?: string;
    id: string;
    input: Input;
    location: string;
    manager: Manager;
    previous_output?: string;
    rule: Rule;
    timestamp: string;
    syscheck?: Syscheck;
    "@timestamp": string;
}

export interface Agent {
    id: string;
    ip?: string;
    name: string;
}

export interface Data {
    integration?: string;
    level?: string;
    virustotal?: Virustotal;
    vulnerability?: Vulnerability;
    win?: Win;
}

export interface Virustotal {
    found: string;
    malicious: string;
    permalink: string;
    positives: string;
    scan_date: string;
    sha1: string;
    source: VirusSource;
    total: string;
}

export interface VirusSource {
    alert_id: string;
    file: string;
    md5: string;
    sha1: string;
}

export interface Vulnerability {
    assigner: string;
    cve: string;
    cvss: Cvss;
    cwe_reference?: string;
    enumeration: string;
    package: Package;
    published: string;
    rationale: string;
    reference: string;
    severity: string;
    status: string;
    title: string;
    updated: string;
    type: string;
}

export interface Cvss {
    cvss2?: Cvss2;
    cvss3?: Cvss3;
}

export interface Cvss2 {
    base_score: string;
    vector: Cvss2Vector;
}

export interface Cvss2Vector {
    access_complexity: string;
    authentication: string;
    availability: string;
    confidentiality_impact: string;
    integrity_impact: string;
}

export interface Cvss3 {
    base_score: string;
    vector: Cvss3Vector;
}

export interface Cvss3Vector {
    attack_vector?: string;
    availability: string;
    confidentiality_impact: string;
    integrity_impact: string;
    privileges_required: string;
    scope: string;
    user_interaction: string;
}

export interface Package {
    architecture: string;
    condition: string;
    name: string;
    source: string;
    version: string;
}

export interface Win {
    eventdata: Eventdata;
    system: System;
}

export interface Eventdata {
    accountName?: string;
    authenticationPackageName?: string;
    binary?: string;
    data?: string;
    errorState?: string;
    type?: string;
    failureReason?: string;
    imagePath?: string;
    ipAddress?: string;
    ipPort?: string;
    keyLength?: string;
    library?: string;
    logonProcessName?: string;
    logonType?: string;
    name?: string;
    param1?: string;
    param2?: string;
    param3?: string;
    param4?: string;
    processId?: string;
    serviceName?: string;
    serviceType?: string;
    startType?: string;
    status?: string;
    subStatus?: string;
    subjectLogonId?: string;
    subjectUserSid?: string;
    targetDomainName?: string;
    targetUserName?: string;
    targetUserSid?: string;
    value?: string;
    win32Error?: string;
    workstationName?: string;
}

export interface System {
    channel: string;
    computer: string;
    eventID: string;
    eventRecordID: string;
    eventSourceName?: string;
    keywords: string;
    level: string;
    message: string;
    opcode?: string;
    processID?: string;
    providerGuid?: string;
    providerName: string;
    severityValue: string;
    systemTime: string;
    task: string;
    threadID?: string;
    version?: string;
}

export interface Decoder {
    name: string;
    parent?: string;
}

export interface Input {
    type: string;
}

export interface Manager {
    name: string;
}

export interface Rule {
    description: string;
    firedtimes: number;
    frequency?: number;
    gdpr?: string[];
    groups: string[];
    hipaa?: string[];
    id: string;
    level: number;
    mail: boolean;
    mitre?: Mitre;
    nist_800_53?: string[];
    pci_dss?: string[];
    tsc?: string[];
}

export interface Mitre {
    id: string[];
    tactic: string[];
    technique: string[];
}

export interface Syscheck {
    changed_attributes: string[];
    event: string;
    gid_after: string;
    gname_after: string;
    inode_after: number;
    inode_before: number;
    md5_after: string;
    mode: string;
    mtime_after: string;
    path: string;
    perm_after: string;
    sha1_after: string;
    sha256_after: string;
    size_after: string;
    uid_after: string;
    uname_after: string;
}

export interface Total {
    relation: string;
    value: number;
}

export interface Shards {
    failed: number;
    skipped: number;
    successful: number;
    total: number;
}
