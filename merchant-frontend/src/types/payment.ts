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
  token: string
  amount_: number
}
interface IWithdrawPayload {
  recp_id: string,
  // amount: number
}
interface IWithdrawEthPayload {
  address: string,
  // amount: number
}

interface IPaymentReportRes {
  // data: {
  //   _id: "deposit" | "withdraw"
  //   totalAmount: number
  // }[]
  // data: {
  //   _id: {
  //     type: "deposit" | "withdraw",
  //     payment_method: "credit" | "wallet"
  //   },
  //   totalAmount: number,
  //   totalWei?: number,
  //   totalEth?: number
  // }[]
  data: {
    totalAmountDeposit: number
    totalDepositCredit: number
    totalDepositWei: number
    totalDepositWallet: number
    totalDepositEth: number
    // totalWithdrawCredit:number
    // totalWithdrawWallet:number
    // totalWithdrawWei:number
    totalAmountWithdraw: number
    amountCreditCanWithdraw: number
    amountWalletCanWithdraw: number
    amountWeiCanWithdraw: number
    amountEthCanWithdraw: number
    amountCreditRemaining:number
  }
}
interface IPaymentStatisticRes {
  data: {
    totalSales: number
    totalOrders: number
    month: number
  }[]
}

interface IRecipientRes {
  object: string
  id: string
  livemode: boolean
  location: string
  deleted: boolean
  bank_account: BankAccount
  active: boolean
  default: boolean
  verified: boolean
  description: any
  email: string
  failure_code: any
  name: string
  tax_id: any
  type: string
  created_at: string
  schedule: any

  verified_at: any
  activated_at: any
}

interface BankAccount {
  object: string
  livemode: boolean
  last_digits: string
  account_number: string
  name: string
  type: any
  created_at: string
  brand: string
  bank_code: string
  branch_code: any
}

