import React from 'react';

export default function DoughResults({ results, yeastBiga, yeastFinal }) {
  // if (!results) return null; // ⛑️ prevent crashing on first render
  console.log("Rendering DoughResults with:", results);
  return (
    <div className="p-4 bg-gray-50 border rounded">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Calculated Outputs:</h2>
      <ul className="space-y-1 text-gray-700 text-sm">
        <li><strong>Total Flour:</strong> {results.totalFlour}g</li>
        <li><strong>Total Water:</strong> {results.totalWater}g</li>
        <li><strong>Salt:</strong> {results.totalSalt}g</li>
        <li><strong>Malt:</strong> {results.totalMalt}g</li>
      </ul>
      <br />
      <ul className="space-y-1 text-gray-700 text-sm">
        <li><strong>Biga Flour:</strong> {results.bigaFlour}g</li>
        <li><strong>Biga Water:</strong> {results.bigaWater}g</li>
        <li><strong>Biga Yeast:</strong> {results.bigaYeast}g ({results.yeastPercent}% bakers %)</li>
      </ul>
      <br />
      <ul className="space-y-1 text-gray-700 text-sm">
        <li><strong>Final Dough Flour:</strong> {results.finalFlour}g</li>
        <li><strong>Final Dough Water:</strong> {results.finalWater}g</li>
      </ul>
      <br />
      <p className="text-sm text-gray-700" title="Yeast used in the preferment (biga)">
  Yeast in Biga: {typeof yeastBiga === 'number' ? yeastBiga.toFixed(3) : '—'}%
</p>
<p className="text-sm text-gray-700" title="Additional yeast added to the final dough for fermentation">
  Yeast in Final Dough: {yeastFinal ? yeastFinal.toFixed(3) : '—'}%
</p>
<p className="font-semibold text-gray-900" title="Total yeast used across both biga and final dough">
  Total Yeast: {(yeastBiga && yeastFinal) ? (yeastBiga + yeastFinal).toFixed(3) : '—'}%
</p>

    </div>
  );
}
