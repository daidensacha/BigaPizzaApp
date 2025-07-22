import React from 'react';

export default function DoughResults({ results, yeastBiga, yeastFinal, inputs }) {
  const handlePrint = () => {
    window.print();
  };

  const finalYeastGrams = (results.finalFlour * yeastFinal) / 100;
  const totalYeastGrams = results.bigaYeast + finalYeastGrams;
  const totalYeastPercent = ((totalYeastGrams / results.totalFlour) * 100).toFixed(3);

  const steps = [
    `Prepare biga: Mix ${results.bigaFlour}g flour, ${results.bigaWater}g water, and ${results.bigaYeast}g yeast.`,
    `Ferment biga for ${inputs.bigaTime} hrs at ${inputs.bigaTemp}°C`,
    `Mix final dough: Add ${results.finalFlour}g flour, ${results.finalWater}g water, ${results.totalSalt}g salt, and ${results.totalMalt}g malt.`,
    `Add ${finalYeastGrams.toFixed(2)}g yeast (${yeastFinal.toFixed(3)}%) to final dough.`,
    `Bulk ferment for ${inputs.doughTime} hrs at ${inputs.doughTemp}°C`,
    `Ball dough into ${inputs.numPizzas}x ${inputs.ballWeight}g pieces.`
  ];

  return (
    <div className="p-4 bg-gray-50 border rounded space-y-4 print:bg-white">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Calculated Outputs</h2>
        <button onClick={handlePrint} className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Print</button>
      </div>

      <details open className="border p-3 rounded">
        <summary className="font-semibold cursor-pointer">Recipe Totals</summary>
        <ul className="text-gray-700 text-sm mt-2">
          <li><strong>Total Flour:</strong> {results.totalFlour}g</li>
          <li><strong>Total Water:</strong> {results.totalWater}g</li>
          <li><strong>Salt:</strong> {results.totalSalt}g</li>
          <li><strong>Malt:</strong> {results.totalMalt}g</li>
          <li><strong>Yeast:</strong> {totalYeastGrams.toFixed(2)}g ({totalYeastPercent}% bakers %)</li>
        </ul>

        <details className="border border-blue-200 mt-3 p-3 rounded bg-blue-50">
          <summary className="font-semibold cursor-pointer text-blue-800">Biga</summary>
          <ul className="text-gray-700 text-sm mt-2">
            <li><strong>Biga Flour:</strong> {results.bigaFlour}g</li>
            <li><strong>Biga Water:</strong> {results.bigaWater}g</li>
            <li><strong>Biga Yeast:</strong> {results.bigaYeast}g ({results.yeastPercent}% bakers %)</li>
            <li><strong>Yeast in Biga:</strong> {typeof yeastBiga === 'number' ? yeastBiga.toFixed(3) : '—'}%</li>
          </ul>
        </details>

        <details className="border border-green-200 mt-3 p-3 rounded bg-green-50">
          <summary className="font-semibold cursor-pointer text-green-800">Final Dough</summary>
          <ul className="text-gray-700 text-sm mt-2">
            <li><strong>Final Dough Flour:</strong> {results.finalFlour}g</li>
            <li><strong>Final Dough Water:</strong> {results.finalWater}g</li>
            <li><strong>Final Dough Yeast:</strong> {finalYeastGrams.toFixed(2)}g ({yeastFinal.toFixed(3)}% bakers %)</li>
          </ul>
        </details>
      </details>

      <details className="border p-3 rounded">
        <summary className="font-semibold cursor-pointer">Fermentation</summary>
        <ul className="text-gray-700 text-sm mt-2">
          <li><strong>Biga:</strong> {inputs.bigaTime} hrs at {inputs.bigaTemp}°C</li>
          <li><strong>Dough:</strong> {inputs.doughTime} hrs at {inputs.doughTemp}°C</li>
        </ul>
      </details>

      <details className="border p-3 rounded">
        <summary className="font-semibold cursor-pointer">Step-by-Step Instructions</summary>
        <ol className="list-decimal pl-4 text-sm text-gray-700 mt-2 space-y-1">
          {steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </details>

      <p className="font-semibold text-gray-900 pt-4" title="Total yeast used across both biga and final dough">
        Total Yeast: {(yeastBiga && yeastFinal) ? (yeastBiga + yeastFinal).toFixed(3) : '—'}%
      </p>
    </div>
  );
}
