// Copyright 2002-2013, University of Colorado
define( function( require ) {
  'use strict';

  // Imports
  var AtomIdentifier = require( 'common/view/AtomIdentifier' );
  var BAAFont = require('common/view/BAAFont');
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Vector2 = require( 'DOT/Vector2' );

  // Constants
  var SYMBOL_BOX_WIDTH = 275; // In screen coords, which are roughly pixels.
  var SYMBOL_BOX_HEIGHT = 300; // In screen coords, which are roughly pixels.
  var NUMBER_FONT = new BAAFont( 45 );
  var NUMBER_INSET = 20; // In screen coords, which are roughly pixels.

  /**
   * Constructor
   * @param numberAtom
   * @constructor
   */
  var SymbolNode = function SymbolNode( numberAtom ) {

    Node.call( this ); // Call super constructor.
    var thisSymbolNode = this;

    // Add the bounding box, which is also the root node for everything else
    // that comprises this node.
    var boundingBox = new Rectangle( 0, 0, SYMBOL_BOX_WIDTH, SYMBOL_BOX_HEIGHT, 0, 0,
                                     {
                                       stroke: 'black',
                                       lineWidth: 2,
                                       fill: 'white'
                                     } );
    this.addChild( boundingBox );

    // Add the symbol text.
    this.symbolText = new Text( "",
                                {
                                  font: new BAAFont( 150 ),
                                  fill: "black",
                                  center: new Vector2( SYMBOL_BOX_WIDTH / 2, SYMBOL_BOX_HEIGHT / 2 )
                                } );

    // Add the listener to update the symbol text.
    numberAtom.protonCountProperty.link( function( protonCount ) {
      var symbol = AtomIdentifier.getSymbol( protonCount );
      thisSymbolNode.symbolText.text = protonCount > 0 ? symbol : "";
      thisSymbolNode.symbolText.center = new Vector2( SYMBOL_BOX_WIDTH / 2, SYMBOL_BOX_HEIGHT / 2 );
    } );
    boundingBox.addChild( this.symbolText );

    // Add the proton count display.
    this.protonCount = new Text( "0",
                                 {
                                   font: NUMBER_FONT,
                                   fill: "red"
                                 } );

    // Add the listener to update the proton count.
    numberAtom.protonCountProperty.link( function( protonCount ) {
      thisSymbolNode.protonCount.text = protonCount;
      thisSymbolNode.protonCount.left = NUMBER_INSET;
      thisSymbolNode.protonCount.bottom = SYMBOL_BOX_HEIGHT - NUMBER_INSET;
    } );
    boundingBox.addChild( this.protonCount );

    // Add the atomic mass display.
    this.atomicMass = new Text( "0",
                                {
                                  font: NUMBER_FONT,
                                  fill: "black"
                                } );
    boundingBox.addChild( this.atomicMass );

    // Add the listener to update the atomic mass.
    numberAtom.atomicMassProperty.link( function( atomicMass ) {
      thisSymbolNode.atomicMass.text = atomicMass;
      thisSymbolNode.atomicMass.left = NUMBER_INSET;
      thisSymbolNode.atomicMass.top = NUMBER_INSET;
    } );

    // Add the charge display.
    this.charge = new Text( "0",
                            {
                              font: NUMBER_FONT,
                              fill: "black"
                            } );
    boundingBox.addChild( this.charge );

    // Add the listener to update the charge.
    numberAtom.chargeProperty.link( function( charge ) {
      var sign = '';
      var textColor;
      if ( charge > 0 ) {
        sign = '+';
        textColor = 'red';
      }
      else if ( charge < 0 ) {
        textColor = 'blue';
      }
      else {
        textColor = 'black';
      }
      thisSymbolNode.charge.text = sign + charge;
      thisSymbolNode.charge.fill = textColor;
      thisSymbolNode.charge.right = SYMBOL_BOX_WIDTH - NUMBER_INSET;
      thisSymbolNode.charge.top = NUMBER_INSET;
    } );
  };

  // Inherit from Node.
  inherit( Node, SymbolNode );

  return SymbolNode;
} );
