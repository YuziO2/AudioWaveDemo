export function throttle(func: Function, delay: number) {
  let timer: any = null;
  return function (this: any, ...args: any[]) {
    let context = this;
    console.log(context);
    if (!timer) {
      timer = setTimeout(function () {
        func.apply(context, args);
        timer = null;
      }, delay);
    }
  }
}