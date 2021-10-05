export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode?: number;
  country: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Location {
  address: Address;
  coordinates: Coordinates;
}
