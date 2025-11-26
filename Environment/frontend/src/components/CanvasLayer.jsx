import React, { useEffect } from 'react'
import L from "leaflet";


const CanvasLayer = ({ map }) => {
    useEffect(() =>{
        // if map doesn't exit then return
        if(!map) return;

        const CustomLayer = L.GridLayer.extend({
            createTile: function(coords){
            // create a <canvas> element for drawing
            const tile = L.DomUtil.create('canvas', 'leaflet-tile');

            // setup tile width and height according to the options
            const size = this.getTileSize();
            tile.width = size.x;
            tile.height = size.y;

            // get a canvas context and draw something on it using coords.x, coords.y and coords.z
            const ctx = tile.getContext('2d');
            ctx.strokeStyle = "lightgray";
            //creating the grid pattern 
            for (let i = 0; i < 16; i++) {
                ctx.lineWidth = 0.3;
                ctx.moveTo(i * 20, 0);
                ctx.lineTo(i * 20, 300);
                ctx.moveTo(0, i * 20);
                ctx.lineTo(300, i * 20);
                ctx.stroke();
            }

            // return the tile so it can be rendered on screen
            return tile;
        },
        });

        //create a layer and adding it to the map
        const layer = new CustomLayer();
        layer.addTo(map);

        //removes the layer from the maps
        return () => {
            map.removeLayer(layer);
        };

    }, [map]);

  //doesn't render anything, just puts a grid over the map
  return null;
};

export default CanvasLayer;