import propertiesConfig from '../config/properties.json';
import boardConfig from '../config/board.json';

export const propertyCatalog = propertiesConfig.map(prop => ({
  ...prop,
  propertyId: prop.id
}));

export const propertyCatalogById = propertyCatalog.reduce((catalog, property) => {
  catalog[property.propertyId] = property;
  return catalog;
}, {});

export const boardData = boardConfig.map((tile) => ({
  ...tile,
  property: tile.propertyId ? propertyCatalogById[tile.propertyId] : null
}));
