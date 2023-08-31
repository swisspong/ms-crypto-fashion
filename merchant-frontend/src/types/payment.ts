interface ICreateOmiseToken {
    card: {
      name: string;
      number: string;
      expiration_month: number;
      expiration_year: number;
      security_code: string;
    };
  }
  interface ICreateOmiseTokenResponse {
    id: string;
    message?: unknown;
  }
 
  interface ICreateCreditCard {
    token: string,
    amount_: number
  }