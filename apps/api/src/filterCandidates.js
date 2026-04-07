// Service for filtering clothing item candidates for outfit suggestions
// Usage: filterCandidates(items, context)

/**
 * @typedef {Object} FilterContext
 * @property {{ tempC: number }} weather
 * @property {string} [occasion]
 * @property {string[]} [avoidColors]
 */

/**
 * @param {Array} items - Array of clothing items
 * @param {FilterContext} context - Filtering context (weather, occasion, avoidColors)
 * @returns {Array} Filtered items
 */
export function filterCandidates(items, context) {
  return items.filter(item => {
    //if (!item.isClean || !item.isAvailable) return false;

    const temp = context.weather.tempC;
    const fitsTemp = temp >= item.temperatureMin && temp <= item.temperatureMax;
    console.log(`Checking item ${item.id}: temp ${temp}°C, fitsTemp: ${fitsTemp}`);
    if (!fitsTemp) return false;

    if (context.occasion && item.occasionTags.length > 0) {
      if (!item.occasionTags.includes(context.occasion) && item.category !== "accessory") {
        return false;
      }
    }

    if (context.avoidColors?.some(color => item.colors.includes(color))) {
      return false;
    }

    return true;
  });
}