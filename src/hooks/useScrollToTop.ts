import { useEffect, type DependencyList } from "react";

type ScrollOptions = Pick<ScrollToOptions, "behavior">;

/**
 * Rola a janela para o topo sempre que `deps` mudar.
 * Sem `deps`, roda apenas na montagem.
 */
export function useScrollToTop(
  deps: DependencyList = [],
  options: ScrollOptions = { behavior: "instant" },
) {
  const { behavior } = options;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
