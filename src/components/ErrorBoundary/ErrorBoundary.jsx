import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Оновлюємо state щоб показати fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Логуємо помилку для діагностики
    console.error('ErrorBoundary спіймала помилку:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Тут можна відправити помилку в сервіс моніторингу
    // наприклад, Sentry, LogRocket і т.д.
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          backgroundColor: '#fff',
          border: '1px solid #ddd',
          borderRadius: '8px',
          margin: '20px',
          fontFamily: 'Arial, sans-serif'
        }}>
          <div style={{ 
            fontSize: '48px', 
            color: '#ff4444', 
            marginBottom: '20px' 
          }}>
            ⚠️
          </div>
          
          <h2 style={{ 
            color: '#333', 
            marginBottom: '16px',
            fontSize: '24px'
          }}>
            Щось пішло не так
          </h2>
          
          <p style={{ 
            color: '#666', 
            marginBottom: '24px',
            fontSize: '16px'
          }}>
            На жаль, сталася неочікувана помилка. 
            Спробуйте оновити сторінку або поверніться пізніше.
          </p>

          <div style={{ marginBottom: '24px' }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                cursor: 'pointer',
                marginRight: '12px'
              }}
            >
              Оновити сторінку
            </button>
            
            <button
              onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Спробувати ще раз
            </button>
          </div>

          {/* Детальна інформація про помилку (тільки в dev режимі) */}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{ 
              textAlign: 'left',
              backgroundColor: '#f8f9fa',
              padding: '16px',
              borderRadius: '4px',
              border: '1px solid #dee2e6'
            }}>
              <summary style={{ 
                cursor: 'pointer',
                fontWeight: 'bold',
                marginBottom: '12px'
              }}>
                Деталі помилки (тільки для розробки)
              </summary>
              
              <div style={{
                fontFamily: 'monospace',
                fontSize: '12px',
                backgroundColor: '#fff',
                padding: '12px',
                borderRadius: '4px',
                marginTop: '8px',
                overflow: 'auto'
              }}>
                <strong>Помилка:</strong>
                <pre style={{ whiteSpace: 'pre-wrap', margin: '8px 0' }}>
                  {this.state.error && this.state.error.toString()}
                </pre>
                
                <strong>Stack trace:</strong>
                <pre style={{ whiteSpace: 'pre-wrap', margin: '8px 0' }}>
                  {this.state.errorInfo.componentStack}
                </pre>
              </div>
            </details>
          )}
        </div>
      );
    }

    // Якщо помилок немає, рендеримо дочірні компоненти як звичайно
    return this.props.children;
  }
}

export default ErrorBoundary;