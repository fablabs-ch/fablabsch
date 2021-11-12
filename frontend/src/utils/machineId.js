export default function machineId(str) {
  let id = "";
  if(!str[0].match(/[A-Za-z]/)) {
    id += "m";
  }
  return id + str.replace(/ /g, '_').replace(/\+/g, 'plus').replace(/[^A-Za-z0-9_:.-]/g, '');
}
