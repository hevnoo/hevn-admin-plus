/**
 * @description: 处理v-model
 * @return {*}
 * useVModel 主要解决的问题是简化 Vue 3 中双向绑定的实现。在 Vue 3 中，实现 v-model 需要：
  1. 接收一个 prop
  2. 监听这个 prop 的变化
  3. 当本地状态变化时，通过 emit 事件通知父组件
  使用 useVModel 可以将这些步骤简化为一行代码。
 */
import { computed, getCurrentInstance, WritableComputedRef } from "vue";

/**
 * 双向绑定 props 的值到本地计算属性
 * @param props 组件的 props 对象
 * @param name 需要双向绑定的 prop 名称
 * @param emit 组件的 emit 函数
 * @param defaultValue 可选的默认值，当 prop 为 undefined 时使用
 * @returns 返回一个可写的计算属性，可以直接用于 v-model 绑定
 */
export function useVModel<
  P extends object,
  K extends keyof P,
  E extends Function
>(props: P, name: K, emit: E, defaultValue?: P[K]): WritableComputedRef<P[K]> {
  const vm = getCurrentInstance();

  return computed({
    get() {
      // 如果 props 中存在该属性则返回，否则返回默认值
      return props[name] !== undefined ? props[name] : defaultValue;
    },
    set(value) {
      // 如果值没有变化，则不触发更新
      if (props[name] === value) return;

      // 触发 update:xxx 事件
      emit(`update:${name as string}`, value);

      // 支持 v-model 的非标准用法，如 change 事件
      emit(`change`, value);
    },
  });
}

/**
 * 为多个 props 创建 v-model 绑定
 * @param props 组件的 props 对象
 * @param emit 组件的 emit 函数
 * @param propsNames 需要绑定的 prop 名称数组
 * @returns 返回一个包含多个可写计算属性的对象
 */
export function useVModels<P extends object, E extends Function>(
  props: P,
  emit: E,
  propsNames: (keyof P)[] = []
): Record<string, WritableComputedRef<any>> {
  const result: Record<string, WritableComputedRef<any>> = {};

  // 如果没有提供 propsNames，则默认绑定所有 props
  const keys = propsNames.length
    ? propsNames
    : (Object.keys(props) as (keyof P)[]);

  for (const key of keys) {
    result[key as string] = useVModel(props, key, emit);
  }

  return result;
}
