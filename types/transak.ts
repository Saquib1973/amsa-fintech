export interface TransakImageSizes {
  large?: string;
  small?: string;
  thumb?: string;
}

export interface TransakNetworkInfo {
  name: string;
  fiatCurrenciesNotSupported?: string[];
  chainId?: string | null;
}

export interface TransakCryptoCurrency {
  _id: string;
  coinId?: string;
  address?: string | null;
  addressAdditionalData?: boolean;
  createdAt?: string;
  decimals?: number;
  image?: TransakImageSizes;
  image_bk?: TransakImageSizes;
  isAllowed?: boolean;
  isPopular?: boolean;
  isStable?: boolean;
  name: string;
  roundOff?: number;
  symbol: string;
  isIgnorePriceVerification?: boolean;
  kycCountriesNotSupported?: string[];
  network?: TransakNetworkInfo;
  uniqueId?: string;
  tokenType?: string;
  tokenIdentifier?: string | null;
  isPayInAllowed?: boolean;
  minAmountForPayIn?: number | null;
  maxAmountForPayIn?: number | null;
}

export interface TransakCryptoCurrenciesResponse {
  response: TransakCryptoCurrency[];
}


