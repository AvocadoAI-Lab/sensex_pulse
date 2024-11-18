import React from 'react';
import {Path, StyleSheet, Svg, Text, View} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    backgroundColor: '#1e293b',
    color: '#ffffff',
    position: 'relative',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    position: 'relative',
    zIndex: 2,
  },
  header: {
    marginBottom: 80,
  },
  logo: {
    width: 56,
    height: 56,
    marginBottom: 40,
  },
  title: {
    fontSize: 48,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 16,
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 20,
    fontFamily: 'Helvetica',
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 1.4,
  },
  mainContent: {
    flex: 1,
    marginBottom: 80,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 40,
  },
  infoCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
    overflow: 'hidden',
  },
  cardIcon: {
    width: 32,
    height: 32,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 13,
    fontFamily: 'Helvetica',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 1.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  footerLeft: {
    flex: 1,
  },
  footerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  footerLabel: {
    fontSize: 12,
    fontFamily: 'Helvetica',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
  },
  footerValue: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
  },
  decorativeCircle: {
    position: 'absolute',
    right: -150,
    top: -150,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    zIndex: 1,
  },
  decorativeLine: {
    position: 'absolute',
    left: 40,
    right: 40,
    bottom: 120,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 1,
  },
  brandHighlight: {
    color: '#3b82f6',
  },
});

const ShieldIcon = () => (
  <Svg width="32" height="32" viewBox="0 0 24 24">
    <Path
      fill="none"
      stroke="#ffffff"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
    />
  </Svg>
);

const ChartIcon = () => (
  <Svg width="32" height="32" viewBox="0 0 24 24">
    <Path
      fill="none"
      stroke="#ffffff"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v7.5m3-9v10.5m-16.5-1.5h18c.621 0 1.125-.504 1.125-1.125V4.125C19.125 3.504 18.621 3 18 3H6c-.621 0-1.125.504-1.125 1.125v13.5c0 .621-.504 1.125-1.125 1.125H2.25c-.621 0-1.125-.504-1.125-1.125V4.125C1.125 3.504 1.629 3 2.25 3h1.5m16.5 0v2.25m-16.5-2.25v2.25m16.5 9.75v-2.25m-16.5 2.25v-2.25m16.5 0h-16.5"
    />
  </Svg>
);

const ShieldCheckIcon = () => (
  <Svg width="32" height="32" viewBox="0 0 24 24">
    <Path
      fill="none"
      stroke="#ffffff"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
    />
  </Svg>
);

export const CoverPage: React.FC = () => {
  const date = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <View style={styles.container}>
      <View style={styles.decorativeCircle} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.logo}>
            <ShieldIcon />
          </View>
          
          <Text style={styles.title}>
            Security Analysis{'\n'}
            Report
          </Text>
          <Text style={styles.subtitle}>
            Comprehensive Security Assessment{'\n'}
            and Threat Analysis
          </Text>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.infoGrid}>
            <View style={styles.infoCard}>
              <View style={styles.cardIcon}>
                <ChartIcon />
              </View>
              <Text style={styles.cardTitle}>Vulnerability Analysis</Text>
              <Text style={styles.cardDescription}>
                In-depth security assessment with CVSS scoring and detailed remediation guidance
              </Text>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.cardIcon}>
                <ShieldCheckIcon />
              </View>
              <Text style={styles.cardTitle}>MITRE Coverage</Text>
              <Text style={styles.cardDescription}>
                Comprehensive evaluation of security events and MITRE ATT&CK framework alignment
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.decorativeLine} />

        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <Text style={styles.footerLabel}>Generated on</Text>
            <Text style={styles.footerValue}>{date}</Text>
          </View>
          <View style={styles.footerRight}>
            <Text style={styles.footerLabel}>Powered by</Text>
            <Text style={styles.footerValue}>
              Sense<Text style={styles.brandHighlight}>X</Text> Analytics
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
