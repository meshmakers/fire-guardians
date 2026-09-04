import {Injectable} from '@angular/core';
import {XLocation} from "../../models/location";

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  public getCurrentLocation(): Promise<XLocation> {

    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (position) {
              console.log(
                'Latitude: ' +
                position.coords.latitude +
                ' Longitude: ' +
                position.coords.longitude
              );
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;

              resolve(({latitude: lat, longitude: lng} as XLocation));
            }
          },
          (error) => reject(error)
        );
      } else {
        reject('Geolocation is not supported by this browser.');
      }
    });
  }


  public async getLocationName(lngLat: google.maps.LatLng): Promise<string> {
    const geocoder = new google.maps.Geocoder();

    const response = await geocoder.geocode({location: lngLat});
    if (response.results[0]) {
      return response.results[0].formatted_address;
    }
    return 'Unknown location';
  }
}
