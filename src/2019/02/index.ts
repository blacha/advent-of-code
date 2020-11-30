export function run(codes: string) {
  const ops = codes.split(',').map((c) => parseInt(c, 10));
  for (let i = 0; i < ops.length; i++) {
    const code = ops[i];
    if (code == 99) {
      break;
    }
    if (code == 1) {
      const valA = ops[ops[i + 1]];
      const valB = ops[ops[i + 2]];
      ops[ops[i + 3]] = valA + valB;
      i += 3;
      continue;
    }
    if (code == 2) {
      const valA = ops[ops[i + 1]];
      const valB = ops[ops[i + 2]];
      ops[ops[i + 3]] = valA * valB;
      i += 3;
      continue;
    }
  }
  return ops.join(',');
}
