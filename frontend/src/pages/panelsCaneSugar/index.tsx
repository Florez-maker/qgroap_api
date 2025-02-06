import { useEffect, useState } from "react";
import client_productions_api from "@/api/ClientProductions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Plot from "react-plotly.js";

function PanelCaneSugar() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reloadData = async () => {
    try {
      const client_productionsData = await client_productions_api.get();
      setData(client_productionsData.client_productions || []);
      setLoading(false);
    } catch (err) {
      setData([]);
      setError("Error fetching client_productions data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadData();
  }, []);

  const haciendas = [...new Set(data.map((item) => item.NOM_HAC))];
  const scatterTraces = haciendas.map((hacienda) => {
    const filteredData = data.filter((item) => item.NOM_HAC === hacienda);
    return {
      x: filteredData.map((item) => item.SAC),
      y: filteredData.map((item) => item.TCH),
      mode: "markers",
      name: hacienda,
    };
  });

  const histogramTrace = [{
    x: data.map((item) => item.TCH),
    type: "histogram",
    marker: { color: "#EA5C1E" },
  }];

  const rootLabel = "Producción";

  const meanTCH = data.reduce((sum, item) => sum + item.TCH, 0) / data.length;

  const uniqueHaciendas = [...new Set(data.map(item => item.NOM_HAC))];

  const labels = [rootLabel];
  const parents = [""];
  const values = [0];
  const customdata = [[]];
  const colors = [];

  uniqueHaciendas.forEach(hacienda => {
    const haciendaData = data.filter(item => item.NOM_HAC === hacienda);
    const haciendaMeanTCH = haciendaData.reduce((sum, item) => sum + item.TCH, 0) / haciendaData.length;

    labels.push(hacienda);
    parents.push(rootLabel);
    values.push(0);
    customdata.push([haciendaMeanTCH]);
    colors.push(haciendaMeanTCH);
  });

  data.forEach(item => {
    labels.push(item.NOM_HAC + " - " + item.STE);
    parents.push(item.NOM_HAC);
    values.push(item.TCH);
    customdata.push([
      item.EDAD_COS, item.NCTE, item.VAR, item.AREA,
      item.TCH, item.SAC
    ]);
    colors.push(item.TCH);
  });

  const treemapTrace = [{
    type: "treemap",
    labels: labels,
    parents: parents,
    values: values,
    customdata: customdata,
    textinfo: "label+value",
    texttemplate: "%{label}<br><br>EDAD COSECHA: %{customdata[0]:.1f}<br>NUM CORTE: %{customdata[1]:.0f}<br>VARIEDAD: %{customdata[2]}<br>AREA: %{customdata[3]:.1f}<br>TCH: %{customdata[4]:.0f}<br>SAC: %{customdata[5]:.1f}",
    marker: {
      colors: colors,
      colorscale: "Spectral",
      cmin: 0,
      cmid: meanTCH,
      cmax: Math.max(...data.map(item => item.TCH)),
      colorbar: {
        title: "TCH",
      }
    }
  }];

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Producción Total por Finca</CardTitle>
        </CardHeader>
        <CardContent>
          <Plot className="col-span-2"
            data={treemapTrace}
            layout={{ title: "Treemap de Producción" }}
            useResizeHandler
            style={{ width: "100%", height: "400px" }}
          />
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Comparación de Producción (TCH vs STE)</CardTitle>
        </CardHeader>
        <CardContent>
          <Plot
            data={scatterTraces}
            layout={{ title: "Producción por finca", xaxis: { title: "Sacarosa" }, yaxis: { title: "TCH" } }}
            useResizeHandler
            style={{ width: "100%", height: "400px" }}
          />
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Distribución de TCH</CardTitle>
        </CardHeader>
        <CardContent>
          <Plot className="col-span-1"
            data={histogramTrace}
            layout={{ title: "Histograma de TCH", xaxis: { title: "TCH" }, yaxis: { title: "Frecuencia" } }}
            useResizeHandler
            style={{ width: "100%", height: "400px" }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default PanelCaneSugar;