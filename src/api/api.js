function maskStorage(mask) {
  let string = '';
  if (mask > 200) {
    string = '#0BA29c';
  } else if ((mask > 100) && (mask < 200)) {
    string = '#FBB03B';
  } else if ((mask < 100) && (mask > 0)) {
    string = '#D4145A';
  } else {
    string = '#00000080';
  }
  return string;
}

/* eslint-disable max-len */
export default function popupCard(pharmacy) {
  return `<div><div style="display:flex;flex-direction:column;padding:1em">
    <div><h3 style="font-size:1.2rem;font-weight:bold;color:#0ba29c">${pharmacy.properties.name}</h3>
    </div><span style="font-size:1rem;margin-bottom:2.5px">
    <i style="margin-right:5px" class="fas fa-phone-alt">
    </i>${pharmacy.properties.phone}</span>
    <span style="font-size:1rem;margin-bottom:2.5px">
    <i style="margin-right:5px" class="fas fa-map-marker-alt"></i>${pharmacy.properties.address}</span>
    <span style="font-size:1rem;margin-bottom:2.5px">
    <i style="margin-right:5px" class="fas fa-quote-right"></i>${pharmacy.properties.note}</span></div>
    <div style="display:flex">
    <div style="border-bottom-left-radius:11px;width:calc(50% + 20px);background-color:${maskStorage(pharmacy.properties.mask_adult)};text-align:center;font-size:1rem;padding:1rem;line-height:1rem;color:#ffffff;margin:0 0 -14px -20px;">成人 ${pharmacy.properties.mask_adult}</div>
    <div style="border-bottom-right-radius:11px;width:calc(50% + 20px);background-color:${maskStorage(pharmacy.properties.mask_child)};text-align:center;font-size:1rem;padding:1rem;line-height:1rem;color:#ffffff;margin:0 -20px -14px 0;">兒童 ${pharmacy.properties.mask_child}</div>
    </div></div>`;
}
