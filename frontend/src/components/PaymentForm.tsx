import React, { useState } from 'react';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Divider,
} from '@mui/material';
import {
  CreditCard as CreditCardIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';

// Inicializar Stripe (substitua pela sua chave pública)
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || '');

interface PaymentFormProps {
  amount: number;
  currency?: string;
  eventId?: number;
  onSuccess?: (paymentIntent: any) => void;
  onError?: (error: string) => void;
}

const CheckoutForm: React.FC<PaymentFormProps> = ({
  amount,
  currency = 'brl',
  eventId,
  onSuccess,
  onError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setError('Stripe não carregou corretamente');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Elemento do cartão não encontrado');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Criar payment intent no backend
      const response = await fetch('/api/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          amount: amount * 100, // Stripe usa centavos
          currency,
          eventId,
        }),
      });

      const { clientSecret } = await response.json();

      // Confirmar pagamento
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'Cliente LETZ',
          },
        },
      });

      if (result.error) {
        setError(result.error.message || 'Erro no pagamento');
        onError?.(result.error.message || 'Erro no pagamento');
      } else {
        setSuccess(true);
        onSuccess?.(result.paymentIntent);
      }
    } catch (err) {
      setError('Erro ao processar pagamento');
      onError?.('Erro ao processar pagamento');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="success.main" gutterBottom>
          🎉 Pagamento realizado com sucesso!
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Você receberá um e-mail de confirmação em breve.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <CreditCardIcon sx={{ mr: 1 }} />
        <Typography variant="h6">
          Informações de Pagamento
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body1" gutterBottom>
          Total: <strong>R$ {amount.toFixed(2)}</strong>
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" gutterBottom>
            Dados do Cartão
          </Typography>
          <Box
            sx={{
              p: 2,
              border: '1px solid #ddd',
              borderRadius: 1,
              '& .StripeElement': {
                height: '40px',
                padding: '10px 12px',
                fontSize: '16px',
              },
            }}
          >
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
                hidePostalCode: true,
              }}
            />
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <SecurityIcon sx={{ mr: 1, fontSize: 16 }} />
          <Typography variant="caption" color="text.secondary">
            Seus dados são protegidos por criptografia SSL
          </Typography>
        </Box>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={!stripe || isLoading}
          sx={{ mt: 2 }}
        >
          {isLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Processando...
            </Box>
          ) : (
            `Pagar R$ ${amount.toFixed(2)}`
          )}
        </Button>
      </form>
    </Paper>
  );
};

const PaymentForm: React.FC<PaymentFormProps> = (props) => {
  if (!process.env.REACT_APP_STRIPE_PUBLIC_KEY) {
    return (
      <Alert severity="warning">
        Stripe não configurado. Configure REACT_APP_STRIPE_PUBLIC_KEY no arquivo .env
      </Alert>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  );
};

// Componente para planos de assinatura
interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
}

interface SubscriptionPlansProps {
  plans: SubscriptionPlan[];
  onSelectPlan: (plan: SubscriptionPlan) => void;
}

export const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({
  plans,
  onSelectPlan,
}) => {
  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      {plans.map((plan) => (
        <Paper
          key={plan.id}
          sx={{
            p: 3,
            minWidth: 280,
            border: plan.popular ? '2px solid' : '1px solid',
            borderColor: plan.popular ? 'primary.main' : 'grey.300',
            position: 'relative',
          }}
        >
          {plan.popular && (
            <Box
              sx={{
                position: 'absolute',
                top: -12,
                left: '50%',
                transform: 'translateX(-50%)',
                bgcolor: 'primary.main',
                color: 'white',
                px: 2,
                py: 0.5,
                borderRadius: 1,
                fontSize: '0.875rem',
              }}
            >
              Mais Popular
            </Box>
          )}

          <Typography variant="h6" gutterBottom>
            {plan.name}
          </Typography>

          <Typography variant="h4" color="primary" gutterBottom>
            R$ {plan.price}
            <Typography component="span" variant="body2" color="text.secondary">
              /mês
            </Typography>
          </Typography>

          <Box sx={{ mb: 3 }}>
            {plan.features.map((feature, index) => (
              <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                ✓ {feature}
              </Typography>
            ))}
          </Box>

          <Button
            variant={plan.popular ? 'contained' : 'outlined'}
            fullWidth
            onClick={() => onSelectPlan(plan)}
          >
            Escolher Plano
          </Button>
        </Paper>
      ))}
    </Box>
  );
};

export default PaymentForm; 