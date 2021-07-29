interface NumberArray {
  [index: number]: number | string;
}
// let nums: NumberArray = [1, 1, 2, 3, "5"];

// let nums: Array<number | string> = [1, 1, 2, 3, "5"];

// let nums: (number | string)[] = [1, 1, 2, 3, "5"];

interface Nums {
  (x: number, y: number): number;
}
let nums: Nums = function (x: number, y: number): number {
  return x + y;
};

function count(x: number, y: number, z?: number): number {
  if (z) {
    return x + y + z;
  } else {
    return x + y;
  }
}
count(1, 2);

function doRest(array: any[], ...items: any[]) {
  items.forEach(function (item) {
    array.push(item);
  });
}
let arr = [];
doRest(arr, 1, 2, 3);

function test() {
  interface Animal {
    name: string;
  }
  interface Cat {
    name: string;
    run(): void;
  }

  let tom: Cat = {
    name: "Tom",
    run: () => {
      console.log("run");
    },
  };
  let animal: Animal = tom;
}

function judge(params: string): void {
  interface Cat {
    name: string;
    run(): void;
  }
  interface Fish {
    name: string;
    swim(): void;
  }
  function isCat(something: Cat | Fish): boolean {
    if ((something as Cat).run) {
      return true;
    }
    return false;
  }
}
