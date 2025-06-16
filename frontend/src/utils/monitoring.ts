// Sistema de Monitoramento e Logs - LETZ

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  userId?: string;
  sessionId: string;
  url: string;
  userAgent: string;
  data?: any;
  error?: Error;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: Date;
  userId?: string;
  sessionId: string;
  additionalData?: any;
}

class MonitoringService {
  private sessionId: string;
  private userId?: string;
  private logBuffer: LogEntry[] = [];
  private metricsBuffer: PerformanceMetric[] = [];
  private isOnline = navigator.onLine;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.setupEventListeners();
    this.startPerformanceMonitoring();
  }

  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  private setupEventListeners() {
    // Monitor online/offline status
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flushBuffers();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    // Monitor unhandled errors
    window.addEventListener('error', (event) => {
      this.logError('Unhandled Error', event.error, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    // Monitor unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
      this.logError('Unhandled Promise Rejection', error);
    });

    // Monitor page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.flushBuffers();
      }
    });

    // Flush buffers before page unload
    window.addEventListener('beforeunload', () => {
      this.flushBuffers();
    });
  }

  private startPerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (perfData) {
          this.trackMetric('page_load_time', perfData.loadEventEnd - perfData.fetchStart);
          this.trackMetric('dom_content_loaded', perfData.domContentLoadedEventEnd - perfData.fetchStart);
          this.trackMetric('first_paint', this.getFirstPaint());
        }
      }, 0);
    });

    // Monitor Core Web Vitals
    this.observeWebVitals();
  }

  private getFirstPaint(): number {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint ? firstPaint.startTime : 0;
  }

  private observeWebVitals() {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.trackMetric('lcp', lastEntry.startTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const fid = (entry as any).processingStart - entry.startTime;
            this.trackMetric('fid', fid);
          }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          this.trackMetric('cls', clsValue);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        this.logError('Error setting up performance observers', err);
      }
    }
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  private createLogEntry(level: LogLevel, message: string, data?: any, error?: Error): LogEntry {
    return {
      level,
      message,
      timestamp: new Date(),
      userId: this.userId,
      sessionId: this.sessionId,
      url: window.location.href,
      userAgent: navigator.userAgent,
      data,
      error,
    };
  }

  logDebug(message: string, data?: any) {
    const entry = this.createLogEntry(LogLevel.DEBUG, message, data);
    this.addToBuffer(entry);
    console.debug(`[LETZ Debug] ${message}`, data);
  }

  logInfo(message: string, data?: any) {
    const entry = this.createLogEntry(LogLevel.INFO, message, data);
    this.addToBuffer(entry);
    console.info(`[LETZ Info] ${message}`, data);
  }

  logWarn(message: string, data?: any) {
    const entry = this.createLogEntry(LogLevel.WARN, message, data);
    this.addToBuffer(entry);
    console.warn(`[LETZ Warning] ${message}`, data);
  }

  logError(message: string, error?: Error, data?: any) {
    const entry = this.createLogEntry(LogLevel.ERROR, message, data, error);
    this.addToBuffer(entry);
    console.error(`[LETZ Error] ${message}`, error, data);
    
    // Send critical errors immediately
    if (this.isOnline) {
      this.sendLogs([entry]);
    }
  }

  trackMetric(name: string, value: number, additionalData?: any) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: new Date(),
      userId: this.userId,
      sessionId: this.sessionId,
      additionalData,
    };

    this.metricsBuffer.push(metric);
    console.debug(`[LETZ Metric] ${name}: ${value}`, additionalData);

    // Auto-flush if buffer gets too large
    if (this.metricsBuffer.length >= 50) {
      this.flushMetrics();
    }
  }

  private addToBuffer(entry: LogEntry) {
    this.logBuffer.push(entry);

    // Auto-flush if buffer gets too large
    if (this.logBuffer.length >= 50) {
      this.flushLogs();
    }
  }

  private async flushBuffers() {
    await Promise.all([
      this.flushLogs(),
      this.flushMetrics(),
    ]);
  }

  private async flushLogs() {
    if (this.logBuffer.length === 0 || !this.isOnline) return;

    const logsToSend = [...this.logBuffer];
    this.logBuffer = [];

    try {
      await this.sendLogs(logsToSend);
    } catch (error) {
      // Re-add logs to buffer on failure
      this.logBuffer.unshift(...logsToSend);
      console.error('Failed to send logs:', error);
    }
  }

  private async flushMetrics() {
    if (this.metricsBuffer.length === 0 || !this.isOnline) return;

    const metricsToSend = [...this.metricsBuffer];
    this.metricsBuffer = [];

    try {
      await this.sendMetrics(metricsToSend);
    } catch (error) {
      // Re-add metrics to buffer on failure
      this.metricsBuffer.unshift(...metricsToSend);
      console.error('Failed to send metrics:', error);
    }
  }

  private async sendLogs(logs: LogEntry[]) {
    const token = localStorage.getItem('token');
    
    await fetch('/api/monitoring/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify({ logs }),
    });
  }

  private async sendMetrics(metrics: PerformanceMetric[]) {
    const token = localStorage.getItem('token');
    
    await fetch('/api/monitoring/metrics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify({ metrics }),
    });
  }

  // Public method to manually flush buffers
  flush() {
    return this.flushBuffers();
  }

  // Method to track user interactions
  trackUserAction(action: string, data?: any) {
    this.logInfo(`User Action: ${action}`, data);
    this.trackMetric('user_action', 1, { action, ...data });
  }

  // Method to track API calls
  trackAPICall(endpoint: string, method: string, duration: number, status: number) {
    this.trackMetric('api_call_duration', duration, {
      endpoint,
      method,
      status,
    });

    if (status >= 400) {
      this.logWarn(`API Error: ${method} ${endpoint}`, { status, duration });
    }
  }
}

// Singleton instance
export const monitoring = new MonitoringService();

// Hook for React components
export const useMonitoring = () => {
  return {
    logDebug: monitoring.logDebug.bind(monitoring),
    logInfo: monitoring.logInfo.bind(monitoring),
    logWarn: monitoring.logWarn.bind(monitoring),
    logError: monitoring.logError.bind(monitoring),
    trackMetric: monitoring.trackMetric.bind(monitoring),
    trackUserAction: monitoring.trackUserAction.bind(monitoring),
    flush: monitoring.flush.bind(monitoring),
  };
}; 