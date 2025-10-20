import React from "react";
import {PieChart, Pie, Cell, Tooltip} from "recharts";
import {cn} from "@/lib/utils"; // Your classnames helper

interface ProgressProps {
    missingPerTab: Record<string, number>;
    totalMissing: number;
    size?: number;
}

export const ProgressPieChart = React.forwardRef<
    SVGSVGElement,
    ProgressProps
>(({missingPerTab, totalMissing, size = 50}, ref) => {
    const TAB_COLORS: Record<string, string> = {
        basic: "#FF6347",      // Tomato Red (stands out well against white)
        transport: "#00BFFF",  // Deep Sky Blue (bright and distinctive)
        contenedor: "#32CD32", // Lime Green (vibrant and eye-catching)
        vacio: "#FFD700",      // Gold (strong contrast against white)
        documents: "#8A2BE2",  // Blue Violet (clear contrast and unique)
    };

    const tabTranslations: Record<string, string> = {
        basic: "Básico",
        transport: "Transporte",
        contenedor: "Contenedor",
        vacio: "Vacío",
        documents: "Documentos",
    };


    const pieData = Object.entries(missingPerTab).map(([tab, missingCount]) => ({
        name: tab,
        value: missingCount,
    }));

    const greenColor = "#10b981";
    const redColor = "#ef4444";

    const isComplete = totalMissing === 0;

    return (
        <div
            className={cn(
                "relative mx-auto",
                `w-[${size}px] h-[${size}px]`
            )}
            style={{maxWidth: size}}
        >
            {isComplete ? (
                <>
                    <PieChart width={size} height={size} ref={ref} aria-label="Complete" role="img">
                        <Pie
                            data={[{name: "complete", value: 1}]}
                            cx="50%"
                            cy="50%"
                            innerRadius={size / 3}
                            outerRadius={size / 2.5}
                            dataKey="value"
                            label={false}
                            labelLine={false}
                            stroke="none"
                        >
                            <Cell fill={greenColor}/>
                        </Pie>
                    </PieChart>
                    <div
                        className={cn(
                            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none",
                            "font-medium leading-none",
                            "text-green-600"
                        )}
                        style={{fontSize: size / 3}}
                        aria-live="polite"
                    >
                        ✓
                    </div>
                </>
            ) : (
                <PieChart width={size} height={size} ref={ref} aria-label="Missing fields chart" role="img">
                    <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={size / 3}
                        outerRadius={size / 2.5}
                        dataKey="value"
                        label={false}
                        labelLine={false}
                        paddingAngle={1}
                        stroke="none"
                    >
                        {pieData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={TAB_COLORS[entry.name] ?? "#888888"}
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: number, name: string) => [
                            `${value}`,
                            `Faltante en ${tabTranslations[name] ?? name}`,
                        ]}
                        wrapperStyle={{fontSize: 10}}
                        contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                            padding: "1px 2px",
                            borderRadius: 6,
                            color: "#333",
                        }}
                        itemStyle={{color: "#333"}}
                        cursor={false}
                    />
                </PieChart>
            )}

            {!isComplete && (
                <div
                    className={cn(
                        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none",
                        "font-medium leading-none",
                        "text-red-500"
                    )}
                    style={{fontSize: size / 3}}
                    aria-live="polite"
                >
                    {totalMissing}
                </div>
            )}
        </div>
    );
});

ProgressPieChart.displayName = "ProgressPieChart";
