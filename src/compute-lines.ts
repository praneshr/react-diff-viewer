import * as diff from 'diff';

export enum DiffType {
  DEFAULT = 0,
  ADDED = 1,
  REMOVED = 2,
}

export interface DiffInformation {
  value?: string | DiffInformation[];
  lineNumber?: number;
  type?: DiffType;
}

export interface LineInformation {
  left?: DiffInformation;
  right?: DiffInformation;
}

export interface ComputedLineInformation {
  lineInformation: LineInformation[];
  diffLines: number[];
}

export interface WordDiffInformation {
  left?: DiffInformation[];
  right?: DiffInformation[];
}

/**
 * Splits diff text by new line and computes final list of diff lines based on
 * conditions.
 *
 * @param value Diff text from the js diff module.
 */
const constructLines = (value: string): string[] => {
  const lines = value.split('\n');
  const isAllEmpty = lines.every((val): boolean => !val);
  if (isAllEmpty) {
    // This is to avoid added an extra new line in the UI.
    if (lines.length === 2) {
      return [];
    }
    lines.pop();
    return lines;
  }

  const lastLine = lines[lines.length - 1];
  const firstLine = lines[0];
  // Remove the first and last element if they are new line character. This is
  // to avoid addition of extra new line in the UI.
  if (!lastLine) {
    lines.pop();
  }
  if (!firstLine) {
    lines.shift();
  }
  return lines;
};

/**
 * Computes word diff information in the line.
 *
 * @param oldValue Old word in the line.
 * @param newValue New word in the line.
 */
const computeWordDiff = (oldValue: string, newValue: string): WordDiffInformation => {
  const diffArray = diff
    .diffChars(oldValue, newValue);
  const wordDiff: WordDiffInformation = {
    left: [],
    right: [],
  };
  diffArray
    .forEach(({ added, removed, value }): DiffInformation => {
      const diffInformation: DiffInformation = {};
      if (added) {
        diffInformation.type = DiffType.ADDED;
        diffInformation.value = value;
        wordDiff.right.push(diffInformation);
      }
      if (removed) {
        diffInformation.type = DiffType.REMOVED;
        diffInformation.value = value;
        wordDiff.left.push(diffInformation);
      }
      if (!removed && !added) {
        diffInformation.type = DiffType.DEFAULT;
        diffInformation.value = value;
        wordDiff.right.push(diffInformation);
        wordDiff.left.push(diffInformation);
      }
      return diffInformation;
    });
  return wordDiff;
};

/**
 * [TODO]: Think about moving common left and right value assignment to a
 * common place. Better readability?
 *
 * Computes line wise information based in the js diff information passed. Each
 * line contains information about left and right section. Left side denotes
 * deletion and right side denotes addition.
 *
 * @param oldString Old string to compare.
 * @param newString New string to compare with old string.
 * @param disableWordDiff Flag to enable/disable word diff.
 */
const computeLineInformation = (
  oldString: string,
  newString: string,
  disableWordDiff: boolean = false,
): ComputedLineInformation => {
  const diffArray = diff.diffLines(
    oldString.trimRight(),
    newString.trimRight(),
    {
      newlineIsToken: true,
      ignoreWhitespace: false,
      ignoreCase: false,
    },
  );
  let rightLineNumber = 0;
  let leftLineNumber = 0;
  let lineInformation: LineInformation[] = [];
  let counter = 0;
  const diffLines: number[] = [];
  const ignoreDiffIndexes: number[] = [];
  const getLineInformation = (
    value: string,
    diffIndex: number,
    added?: boolean,
    removed?: boolean,
  ): LineInformation[] => {
    if (ignoreDiffIndexes.includes(diffIndex)) {
      return [];
    }
    const lines = constructLines(value);

    return lines.map((line: string): LineInformation => {
      const left: DiffInformation = {};
      const right: DiffInformation = {};
      if (added || removed) {
        if (!diffLines.includes(counter)) {
          diffLines.push(counter);
        }
        if (removed) {
          leftLineNumber += 1;
          left.lineNumber = leftLineNumber;
          left.type = DiffType.REMOVED;
          left.value = line || ' ';
          // When the current line is of type REMOVED, check the next item in
          // the diff array whether it is of type ADDED. If true, the current
          // diff will be marked as both REMOVED and ADDED. Meaning, the
          // current line is a modification.
          const nextDiff = diffArray[diffIndex + 1];
          if (nextDiff && nextDiff.added) {
            const {
              value:
              rightValue,
              lineNumber,
              type,
            } = getLineInformation(nextDiff.value, diffIndex, true)[0].right;
            // When identified as modification, push the next diff to ignore
            // list as the next value will be added in this line computation as
            // right and left values.
            ignoreDiffIndexes.push(diffIndex + 1);
            right.lineNumber = lineNumber;
            right.type = type;
            // Do word level diff and assign the corresponding values to the
            // left and right diff information object.
            if (disableWordDiff) {
              right.value = rightValue;
            } else {
              const wordDiff = computeWordDiff(line, rightValue as string);
              right.value = wordDiff.right;
              left.value = wordDiff.left;
            }
          }
        } else {
          rightLineNumber += 1;
          right.lineNumber = rightLineNumber;
          right.type = DiffType.ADDED;
          right.value = line;
        }
      } else {
        leftLineNumber += 1;
        rightLineNumber += 1;

        left.lineNumber = leftLineNumber;
        left.type = DiffType.DEFAULT;
        left.value = line;
        right.lineNumber = rightLineNumber;
        right.type = DiffType.DEFAULT;
        right.value = line;
      }

      counter += 1;
      return { right, left };
    });
  };

  diffArray
    .forEach(({ added, removed, value }: diff.Change, index): void => {
      lineInformation = [
        ...lineInformation,
        ...getLineInformation(value, index, added, removed),
      ];
    });
  return {
    lineInformation, diffLines,
  };
};

export default computeLineInformation;
