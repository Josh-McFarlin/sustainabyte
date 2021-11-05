export interface AddressType {
  street: string;
  city: string;
  state: string;
  zipCode?: number;
  country: string;
}

export interface CoordinatesType {
  latitude: number;
  longitude: number;
}

export interface LocationType {
  address: AddressType;
  coordinates: CoordinatesType;
}
