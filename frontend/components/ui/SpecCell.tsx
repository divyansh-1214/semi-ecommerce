import { PartSpec } from "@/types";

interface SpecCellProps {
  specs: PartSpec[];
  columnName: string;
}

/**
 * Renders a table cell for a part's spec value, handling three states:
 *
 * 1. Column NOT in specs array → not associated (empty CSV cell) → blank cell
 * 2. Column in specs, value === null → associated but dash cell → renders "-"
 * 3. Column in specs, value === "X" → associated with value → renders "X"
 */
export default function SpecCell({ specs, columnName }: SpecCellProps) {
  const spec = specs.find((s) => s.column === columnName);

  if (!spec) {
    // Not associated — empty CSV cell, render blank
    return (
      <td className="px-4 py-3 border-b border-gray-100 text-gray-300">
      </td>
    );
  }

  if (spec.value === null) {
    // Dash cell — associated but value missing
    return (
      <td className="px-4 py-3 border-b border-gray-100 text-gray-400">
        -
      </td>
    );
  }

  // Filled cell — associated with value
  return (
    <td className="px-4 py-3 border-b border-gray-100 text-gray-700">
      {spec.value}
    </td>
  );
}
