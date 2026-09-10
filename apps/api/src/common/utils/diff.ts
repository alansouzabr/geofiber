export function diffObjects(before: any, after: any) {
  const changes: any = {};

  for (const key in after) {
    if (
      before[key] !== after[key] &&
      JSON.stringify(before[key]) !== JSON.stringify(after[key])
    ) {
      changes[key] = {
        before: before[key],
        after: after[key],
      };
    }
  }

  return changes;
}
