import { useMemo } from "react";

type Props<T> = {
  items: T[];
  layout?: [number, number]; // cols, rows
};

/*
 *  Hook utilitário para transformar um array de items
 *  em arrays aninhados, dado a devida configuração de
 *  formato de grid (ex: 5 por 5 [5 colunas, 5 linhas])
 *
 *  Usado em sessões onde um Carrousel com seus slides
 *  composto por um grid de opções, assimilando-se a
 *  um grid "paginado" visualmente apenas, uma vez que
 *  todos os itens precisam estar carregados pra montar
 *  o grid.
 *
 *  TODO: * testar mais extensivamente
 *        * validar os inputs (items, layout)
 */

export function useGridSlide<T>({ items, layout }: Props<T>) {
  const slides = useMemo(() => {
    if (!Array.isArray(items)) {
      throw Error('`useGridSlide`: "items" must be array.');
    }

    // arr que será populado
    const list: Array<T[]> = [];
    if (!items.length) return list;

    // regra de formato do grid em colunas e linhas
    let cols = 1,
      rows = 1;
    if (layout) {
      (cols = layout[0]), (rows = layout[1]);
    }

    const gridLimit = cols * rows;

    // distribuir os items em grid
    items.forEach((item) => {
      const currentIndex = list.length === 0 ? 0 : list.length - 1;
      const initialized = Array.isArray(list[currentIndex]);

      if (initialized) {
        if (list[currentIndex].length === gridLimit) {
          list.push([item]);
          return;
        }

        list[currentIndex].push(item);
        return;
      }

      list.push([item]);
      return;
    });

    return list;
  }, [layout, items]);

  return slides;
}
