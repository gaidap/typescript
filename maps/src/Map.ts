const GOOGLE_MODULE_NOT_LOADED = 'google is not defined';

export interface Mappable {
  location: {
    lat: number,
    lng: number
  };
  markerContent(): string;
}

export class Map {
  private googleMap: google.maps.Map;

  constructor(elementId: string) {
    this.initNewGoogleMap(elementId);
  }

  addGoogleMarker(newMappable: Mappable): void {
    this.addGoogleMarkerDelayed((mappable: Mappable, map: google.maps.Map): void => {
      const marker = new google.maps.Marker({
        map: map,
        position: {
          lat: mappable.location.lat,
          lng: mappable.location.lng
        }
      });
      marker.addListener('click', () => {
        const infoWindow = new google.maps.InfoWindow({
          content: mappable.markerContent()
        });
        infoWindow.open(map, marker);
      });
    }, newMappable);
  }

  // Quick and simple solution to wait for google maps api to load in benefit of hiding the api key with dotenv
  private initNewGoogleMap(elementId: string): void {
    try {
      const newCustomMap = new google.maps.Map(document.getElementById(elementId), {
        backgroundColor: 'black',
        zoom: 1,
        center: {
          lat: 0,
          lng: 0
        }
      });
      this.googleMap = newCustomMap;
    } catch (error) {
      if (error.message.includes(GOOGLE_MODULE_NOT_LOADED)) {
        setTimeout(this.initNewGoogleMap, 100, elementId);
      } else {
        throw error;
      }
    };
  }
  private addGoogleMarkerDelayed(delayedFn: Function, mappable: Mappable) {
    if (this.googleMap !== undefined) {
      delayedFn(mappable, this.googleMap);
    } else {
      setTimeout(this.addGoogleMarkerDelayed, 100, delayedFn, mappable);
    }
  }
}
