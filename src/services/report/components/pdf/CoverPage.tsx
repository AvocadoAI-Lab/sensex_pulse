import React from 'react';
import {Path, StyleSheet, Svg, Text, View} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    backgroundColor: '#1e293b', // Darker, more professional blue
    color: '#ffffff',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  content: {
    flex: 1,
    position: 'relative',
    zIndex: 1,
  },
  header: {
    marginBottom: 60,
  },
  logo: {
    width: 64,
    height: 64,
    marginBottom: 40,
  },
  title: {
    fontSize: 42,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 16,
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 24,
    fontFamily: 'Helvetica',
    marginBottom: 60,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  cardsContainer: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 60,
  },
  card: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardIcon: {
    width: 40,
    height: 40,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 12,
    color: '#ffffff',
  },
  cardDescription: {
    fontSize: 14,
    fontFamily: 'Helvetica',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 1.6,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Helvetica',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  footerHighlight: {
    color: '#ffffff',
    fontFamily: 'Helvetica-Bold',
  },
  decorativeShape: {
    position: 'absolute',
    top: 40,
    right: 40,
    opacity: 0.1,
  },
});

const ShieldIcon = () => (
  <Svg width="40" height="40" viewBox="0 0 24 24">
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

const AlertIcon = () => (
  <Svg width="40" height="40" viewBox="0 0 24 24">
    <Path
      fill="none"
      stroke="#ffffff"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
    />
  </Svg>
);

const ChartIcon = () => (
  <Svg width="40" height="40" viewBox="0 0 24 24">
    <Path
      fill="none"
      stroke="#ffffff"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
    />
  </Svg>
);

const DecorativeShape = () => (
  <Svg width="200" height="200" viewBox="0 0 200 200">
    <Path
      fill="#ffffff"
      d="M100 0C44.8 0 0 44.8 0 100s44.8 100 100 100 100-44.8 100-100S155.2 0 100 0zm0 180c-44.2 0-80-35.8-80-80s35.8-80 80-80 80 35.8 80 80-35.8 80-80 80z"
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
      <View style={styles.decorativeShape}>
        <DecorativeShape />
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.logo}>
            <ShieldIcon />
          </View>
          
          <Text style={styles.title}>Security Analysis Report</Text>
          <Text style={styles.subtitle}>Comprehensive Security Assessment</Text>
        </View>

        <View style={styles.cardsContainer}>
          <View style={styles.card}>
            <View style={styles.cardIcon}>
              <AlertIcon />
            </View>
            <Text style={styles.cardTitle}>Threat Analysis</Text>
            <Text style={styles.cardDescription}>
              In-depth security assessment and vulnerability evaluation with CVSS scoring
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardIcon}>
              <ChartIcon />
            </View>
            <Text style={styles.cardTitle}>Impact Analysis</Text>
            <Text style={styles.cardDescription}>
              Comprehensive evaluation of security events and MITRE ATT&CK coverage
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardIcon}>
              <ShieldIcon />
            </View>
            <Text style={styles.cardTitle}>Recommendations</Text>
            <Text style={styles.cardDescription}>
              Strategic insights and actionable security improvement measures
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View>
          <Text style={styles.footerText}>Generated on</Text>
          <Text style={styles.footerHighlight}>{date}</Text>
        </View>
        <View>
          <Text style={styles.footerText}>Powered by</Text>
          <Text style={styles.footerHighlight}>Sensex Analytics</Text>
        </View>
      </View>
    </View>
  );
};
