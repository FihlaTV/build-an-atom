// Copyright 2013-2019, University of Colorado Boulder

/**
 * A node that presents a comparison of the protons and electrons in an atom in order to make the net charge apparent.
 *
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const buildAnAtom = require( 'BUILD_AN_ATOM/buildAnAtom' );
  const BuildAnAtomModel = require( 'BUILD_AN_ATOM/common/model/BuildAnAtomModel' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );

  // constants
  const SYMBOL_WIDTH = 12;
  const VERTICAL_INSET = 5;
  const INTER_SYMBOL_DISTANCE = SYMBOL_WIDTH * 0.4;
  const SYMBOL_LINE_WIDTH = SYMBOL_WIDTH * 0.3;

  /**
   * @param {NumberAtom} numberAtom - model representation of the atom
   * @param {Tandem} tandem
   * @param {Object} options
   * @constructor
   */
  function ChargeComparisonDisplay( numberAtom, tandem, options ) {

    Node.call( this, { tandem: tandem } );

    const MAX_CHARGE = BuildAnAtomModel.MAX_CHARGE;
    let i;

    // Parent node for all symbols.
    const symbolLayer = new Node( { tandem: tandem.createTandem( 'symbolLayer' ) } );

    const minusSymbolShape = new Shape();
    minusSymbolShape.moveTo( -SYMBOL_WIDTH / 2, -SYMBOL_LINE_WIDTH / 2 );
    minusSymbolShape.lineTo( SYMBOL_WIDTH / 2, -SYMBOL_LINE_WIDTH / 2 );
    minusSymbolShape.lineTo( SYMBOL_WIDTH / 2, SYMBOL_LINE_WIDTH / 2 );
    minusSymbolShape.lineTo( -SYMBOL_WIDTH / 2, SYMBOL_LINE_WIDTH / 2 );
    minusSymbolShape.close();

    const minusSymbolPath = new Path( minusSymbolShape, {
      stroke: 'black',
      lineWidth: 1,
      fill: 'rgb( 100, 100, 255 )',
      left: INTER_SYMBOL_DISTANCE / 2,
      centerY: VERTICAL_INSET + SYMBOL_WIDTH * 1.5
    } );

    const minusesGroupTandem = tandem.createGroupTandem( 'minuses' );
    const minuses = [];
    for ( i = 0; i < MAX_CHARGE; i++ ) {
      const minusSymbol = new Node( {
        children: [ minusSymbolPath ],
        x: i * ( SYMBOL_WIDTH + INTER_SYMBOL_DISTANCE ),
        tandem: minusesGroupTandem.createNextTandem()
      } );
      minuses.push( minusSymbol );
      symbolLayer.addChild( minusSymbol );
    }

    const plusSymbolShape = new Shape();
    plusSymbolShape.moveTo( -SYMBOL_LINE_WIDTH / 2, -SYMBOL_LINE_WIDTH / 2 );
    plusSymbolShape.lineTo( -SYMBOL_LINE_WIDTH / 2, -SYMBOL_WIDTH / 2 );
    plusSymbolShape.lineTo( SYMBOL_LINE_WIDTH / 2, -SYMBOL_WIDTH / 2 );
    plusSymbolShape.lineTo( SYMBOL_LINE_WIDTH / 2, -SYMBOL_LINE_WIDTH / 2 );
    plusSymbolShape.lineTo( SYMBOL_WIDTH / 2, -SYMBOL_LINE_WIDTH / 2 );
    plusSymbolShape.lineTo( SYMBOL_WIDTH / 2, SYMBOL_LINE_WIDTH / 2 );
    plusSymbolShape.lineTo( SYMBOL_LINE_WIDTH / 2, SYMBOL_LINE_WIDTH / 2 );
    plusSymbolShape.lineTo( SYMBOL_LINE_WIDTH / 2, SYMBOL_WIDTH / 2 );
    plusSymbolShape.lineTo( -SYMBOL_LINE_WIDTH / 2, SYMBOL_WIDTH / 2 );
    plusSymbolShape.lineTo( -SYMBOL_LINE_WIDTH / 2, SYMBOL_LINE_WIDTH / 2 );
    plusSymbolShape.lineTo( -SYMBOL_WIDTH / 2, SYMBOL_LINE_WIDTH / 2 );
    plusSymbolShape.lineTo( -SYMBOL_WIDTH / 2, -SYMBOL_LINE_WIDTH / 2 );
    plusSymbolShape.close();

    const plusSymbolPath = new Path( plusSymbolShape, {
      stroke: 'black',
      lineWidth: 1,
      fill: PhetColorScheme.RED_COLORBLIND,
      left: INTER_SYMBOL_DISTANCE / 2,
      centerY: VERTICAL_INSET + SYMBOL_WIDTH / 2
    } );

    const plussesGroupTandem = tandem.createGroupTandem( 'plusses' );
    const plusses = [];
    for ( i = 0; i < MAX_CHARGE; i++ ) {
      const plusSymbol = new Node( {
        children: [ plusSymbolPath ],
        x: i * ( SYMBOL_WIDTH + INTER_SYMBOL_DISTANCE ),
        tandem: plussesGroupTandem.createNextTandem()
      } );
      plusses.push( plusSymbol );
      symbolLayer.addChild( plusSymbol );
    }

    // width will be changed dynamically, all of the others will remain static
    const matchBox = new Rectangle( 0, 0, INTER_SYMBOL_DISTANCE / 2, 2 * SYMBOL_WIDTH + 2 * VERTICAL_INSET, 4, 4, {
      lineWidth: 1,
      stroke: 'black',
      visible: false,
      tandem: tandem.createTandem( 'matchBox' )
    } );
    symbolLayer.addChild( matchBox );

    // Function that updates that displayed charge.
    const update = function( atom ) {

      // toggle plus visibility
      for ( let numProtons = 0; numProtons < MAX_CHARGE; numProtons++ ) {
        plusses[ numProtons ].visible = numProtons < atom.protonCountProperty.get();
      }

      // toggle minus visibility
      for ( let numElectrons = 0; numElectrons < MAX_CHARGE; numElectrons++ ) {
        minuses[ numElectrons ].visible = numElectrons < atom.electronCountProperty.get();
      }

      // matching box
      const numMatchedSymbols = Math.min( atom.protonCountProperty.get(), atom.electronCountProperty.get() );
      matchBox.visible = numMatchedSymbols > 0;
      matchBox.rectWidth = INTER_SYMBOL_DISTANCE / 2 + ( numMatchedSymbols * SYMBOL_WIDTH ) + ( ( numMatchedSymbols - 0.5 ) * INTER_SYMBOL_DISTANCE );
    };

    // Workaround for issue where location can't be set if no bounds exist.
    this.addChild( new Rectangle( 0, 0, SYMBOL_WIDTH, 2 * SYMBOL_WIDTH + 2 * VERTICAL_INSET, 0, 0, {
      fill: 'rgba( 0, 0, 0, 0 )'
    } ) );

    // Hook up the update function.
    numberAtom.particleCountProperty.link( function() {
      update( numberAtom );
    } );

    this.addChild( symbolLayer ); // added at the end so we have faster startup times

    this.mutate( options );
  }

  buildAnAtom.register( 'ChargeComparisonDisplay', ChargeComparisonDisplay );

  // Inherit from Node.
  return inherit( Node, ChargeComparisonDisplay );
} );
