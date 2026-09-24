/** Clicar no ponto do valor atual diminui 1; qualquer outro ponto define o valor. */
export function nextDotValue(current: number, clicked: number): number {
  return current === clicked ? clicked - 1 : clicked;
}
