export function Unformatted (value) {
 return  value.replace('.', '')
              .replace('.', '')
              .replace('-', '')
              .replace('(', '')
              .replace(')', '');
}
