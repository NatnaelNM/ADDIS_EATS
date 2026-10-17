export function validateOrder(data) {
  const fieldErrors = {};
  const phone = String(data.phone || "").trim();
  const neighborhood = String(data.neighborhood || "").trim();
  const deliveryAddress = String(data.deliveryAddress || "").trim();
  const landmark = String(data.landmark || "").trim();
  const mapLocation = String(data.mapLocation || "").trim();

  if (!phone) {
    fieldErrors.phone = ["Phone is required"];
  } else if (!/^09\d{8}$/.test(phone) && !/^\+2519\d{8}$/.test(phone)) {
    fieldErrors.phone = ["Use 09... or +2519..."];
  }
  if (!neighborhood || neighborhood.length > 80) {
    fieldErrors.neighborhood = ["Select a valid delivery neighborhood"];
  }
  if (!deliveryAddress || deliveryAddress.length < 5 || deliveryAddress.length > 500) {
    fieldErrors.deliveryAddress = ["Enter delivery directions (5–500 characters)"];
  }

  if (mapLocation && !/^-?\d{1,2}\.\d{1,8},\s*-?\d{1,3}\.\d{1,8}$/.test(mapLocation)) {
    fieldErrors.mapLocation = ["Select a valid point on the map"];
  }

  if (landmark.length > 160) {
    fieldErrors.landmark = ["Landmark must be 160 characters or fewer"];
  }

  if (Object.keys(fieldErrors).length) return { success: false, fieldErrors };
  return { success: true, data: { phone, neighborhood, deliveryAddress, landmark, mapLocation } };
}
