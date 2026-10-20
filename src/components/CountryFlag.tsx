/** Local SVGs render consistently on desktops without country-flag emoji fonts.
 * Decorative: the adjacent country name provides the accessible label.
 */
export default function CountryFlag({ iso }: { iso: string }) {
  return <img className="country-flag" src={`${import.meta.env.BASE_URL}flags/${iso.toLowerCase()}.svg`}
    alt="" aria-hidden="true" width="24" height="18" />;
}
