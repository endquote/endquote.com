// https://www-artifexpress-com.i.ezproxy.nypl.org/catalogues/sol-lewitt-wall-drawings/artist/info-pages/5aa6a1bfa622562e82cdce67

// 1 = | black
// 2 = - yellow
// 3 = / red
// 4 = \ blue

// "There are four Drawing Series, each containing 24 drawings."
function build() {
  const p = permutations();
  const series1 = change(p, rotate);
  const series2 = change(p, mirror);
  const series3 = change(p, crossMirror);
  const series4 = change(p, crossReverse);
  return [series1, series2, series3, series4];
}

// "The first part (top left quarter) of each drawing is based on one of the 24 possible permutations of the numbers 1, 2, 3, and 4 (i.e., 1234, 2314, etc.)."
function permutations(
  arr = [1, 2, 3, 4],
  prefix: number[] = [],
  out: number[][] = []
): number[][] {
  const n = arr.length;
  if (n == 0) {
    out.push(prefix);
  } else {
    for (let i = 0; i < n; i++) {
      permutations(
        arr.slice(0, i).concat(arr.slice(i + 1, n)),
        prefix.concat(arr[i]),
        out
      );
    }
  }
  return out;
}

// "The other three parts are then created based on modifying the first part, using four different systems of change."
function change(
  permutations: number[][],
  system: (permutation: number[], iteration: number) => number[]
) {
  const out = [];
  for (let permuation = 0; permuation < permutations.length; permuation++) {
    const ne = system(permutations[permuation], 1);
    const se = system(ne, 2);
    const sw = system(se, 3);
    const nw = system(sw, 4);
    out.push([nw, ne, sw, se]);
  }
  return out;
}

// "In Drawing Series I, the other three parts are created by rotating the first part"
function rotate(permutation: number[], iteration: number) {
  return [permutation[2], permutation[0], permutation[3], permutation[1]];
}

// "in Drawing Series II, the other three parts are created by mirroring the first part"
function mirror(permutation: number[], iteration: number) {
  if (iteration % 2) {
    return [permutation[1], permutation[0], permutation[3], permutation[2]];
  } else {
    return [permutation[2], permutation[3], permutation[0], permutation[1]];
  }
}

// "in Drawing Series III, the other three parts are created by “cross-mirroring” the first part"
function crossMirror(permutation: number[], iteration: number) {
  if (iteration % 2) {
    return [permutation[0], permutation[2], permutation[1], permutation[3]];
  } else {
    return [permutation[1], permutation[3], permutation[0], permutation[2]];
  }
}

// "and in Drawing Series IV, the other three parts are created by “cross-reversing” the first part"
function crossReverse(permutation: number[], iteration: number) {
  if (iteration % 2) {
    return [permutation[2], permutation[3], permutation[0], permutation[1]];
  } else {
    return [permutation[3], permutation[2], permutation[1], permutation[0]];
  }
}

const schematic = build();

export default schematic;
