export interface Types {
    _shards:   Shards;
    hits:      Hits;
    timed_out: boolean;
    took:      number;
}

export interface Shards {
    failed:     number;
    skipped:    number;
    successful: number;
    total:      number;
}

export interface Hits {
    hits:      Hit[];
    max_score: null;
    total:     Total;
}

export interface Hit {
    _id:     string;
    _index:  string;
    _score:  null;
    _source: Source;
    sort:    number[];
}

export interface Source {
    agent:     Agent;
    data:      Data;
    decoder:   Decoder;
    location:  string;
    manager:   Decoder;
    rule:      Rule;
    timestamp: string;
}

export interface Agent {
    id:   string;
    name: string;
}

export interface Data {
    integration?:   string;
    virustotal?:    Virustotal;
    vulnerability?: Vulnerability;
    win?:           Win;
    sca?:          ScaData;  // Adding SCA type
}

export interface ScaData {
    passed?: string;
    failed?: string;
    invalid?: string;
    policy?: string;
}

export interface Virustotal {
    found:     string;
    malicious: string;
    permalink: string;
    positives: string;
    scan_date: Date;
    sha1:      string;
    source:    SourceClass;
    total:     string;
}

export interface SourceClass {
    alert_id: string;
    file:     string;
    md5:      string;
    sha1:     string;
}

export interface Vulnerability {
    assigner:       string;
    cve:            string;
    cvss:           Cvss;
    cwe_reference?: string;
    enumeration:    string;
    package:        Package;
    published:      Date;
    rationale:      string;
    reference:      string;
    severity:       string;
    status:         string;
    title:          string;
    type:           string;
    updated:        Date;
}

export interface Cvss {
    cvss2?: Cvss2;
    cvss3?: Cvss3;
}

export interface Cvss2 {
    base_score: string;
    vector:     Cvss2Vector;
}

export interface Cvss2Vector {
    access_complexity:      string;
    authentication:         string;
    availability:           string;
    confidentiality_impact: string;
    integrity_impact:       string;
}

export interface Cvss3 {
    base_score: string;
    vector:     Cvss3Vector;
}

export interface Cvss3Vector {
    attack_vector?:         string;
    availability:           string;
    confidentiality_impact: string;
    integrity_impact:       string;
    privileges_required:    string;
    scope:                  string;
    user_interaction:       string;
}

export interface Package {
    architecture: string;
    condition:    string;
    name:         string;
    source:       string;
    version:      string;
}

export interface Win {
    eventdata: Eventdata;
    system:    System;
}

export interface Eventdata {
    accountName?:               string;
    authenticationPackageName?: string;
    binary?:                    string;
    data?:                      string;
    failureReason?:             string;
    imagePath?:                 string;
    ipAddress?:                 string;
    ipPort?:                    string;
    keyLength?:                 string;
    logonProcessName?:          string;
    logonType?:                 string;
    param1?:                    string;
    processId?:                 string;
    serviceName?:               string;
    serviceType?:               string;
    startType?:                 string;
    status?:                    string;
    subStatus?:                 string;
    subjectLogonId?:            string;
    subjectUserSid?:            string;
    targetDomainName?:          string;
    targetUserName?:            string;
    targetUserSid?:             string;
    workstationName?:           string;
}

export interface System {
    channel:          string;
    computer:         string;
    eventID:          string;
    eventRecordID:    string;
    eventSourceName?: string;
    keywords:         string;
    level:            string;
    message:          string;
    opcode:           string;
    processID:        string;
    providerGuid?:    string;
    providerName:     string;
    severityValue:    string;
    systemTime:       Date;
    task:             string;
    threadID:         string;
    version:          string;
}

export interface Decoder {
    name: string;
}

export interface Rule {
    description: string;
    groups:      string[];
    id:          string;
    level:       number;
}

export interface Total {
    relation: string;
    value:    number;
}
