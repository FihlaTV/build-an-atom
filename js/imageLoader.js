define( function( require ) {
  "use strict";

  //Will be added lazily after image loader complete.
  //Makes it possible to load through the module system rather than passed as parameter everywhere or used as global. 

  return {
    imageNames: [
      'scale.png',
      'scale.svg',
      'charge_meter_short_background.svg',
      'charge_meter_background.svg',
      'atom_builder_charge_meter_no_window.png'
    ]
  };
} );