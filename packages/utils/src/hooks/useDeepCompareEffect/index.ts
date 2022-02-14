import type { DependencyList } from 'react';
import { useEffect, useRef } from 'react';
import isDeepEqualReact from '../../isDeepEqualReact';
import useDebounceFn from '../useDebounceFn';

export const isDeepEqual = (a: any, b: any, ignoreKeys?: string[]) =>
  isDeepEqualReact(a, b, ignoreKeys);

function useDeepCompareMemoize(value: any, ignoreKeys?: string[]) {
  const ref = useRef();
  // it can be done by using useMemo as well
  // but useRef is rather cleaner and easier
  if (!isDeepEqual(value, ref.current, ignoreKeys)) {
    ref.current = value;
  }

  return ref.current;
}

function useDeepCompareEffect(
  effect: React.EffectCallback,
  dependencies: DependencyList,
  ignoreKeys?: string[],
) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, useDeepCompareMemoize(dependencies || [], ignoreKeys));
}

function useDeepCompareEffectDebounce(
  effect: React.EffectCallback,
  dependencies: DependencyList,
  ignoreKeys?: string[],
  waitTime?: number,
) {
  const effectDn = useDebounceFn(async () => {
    effect();
  }, waitTime || 16);
  useEffect(() => {
    effectDn.run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, useDeepCompareMemoize(dependencies || [], ignoreKeys));
}
export { useDeepCompareEffectDebounce };
export default useDeepCompareEffect;
