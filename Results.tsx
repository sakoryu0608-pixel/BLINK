import React, { useMemo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Scores } from '../types';
import { ENNEAGRAM_TYPES } from '../constants';

const RESULT_URLS: { [key: number]: string } = {
    1: "https://enneagram9.my.canva.site/9sins/type1",
    2: "https://enneagram9.my.canva.site/9sins/type2",
    3: "https://enneagram9.my.canva.site/9sins/type3",
    4: "https://enneagram9.my.canva.site/9sins/type4",
    5: "https://enneagram9.my.canva.site/9sins/type5",
    6: "https://enneagram9.my.canva.site/9sins/type6",
    7: "https://enneagram9.my.canva.site/9sins/type7",
    8: "https://enneagram9.my.canva.site/9sins/type8",
    9: "https://enneagram9.my.canva.site/9sins/type9"
};

interface ResultsProps {
    scores: Scores;
    onRestart: () => void;
}

// Custom tick component for the RadarChart's angle axis to display labels in two lines.
const CustomAngleAxisTick = (props: any) => {
    const { x, y, textAnchor, payload } = props;
    // Split the label into Type ID (e.g., "T1") and Type Name (e.g., "完璧主義者")
    const [typeId, ...typeNameParts] = payload.value.split(' ');
    const typeName = typeNameParts.join(' ');

    return (
        <text
            x={x}
            y={y}
            textAnchor={textAnchor}
            dominantBaseline="central"
            fill="#475569"
            fontSize={12}
        >
            <tspan x={x} dy="-0.6em" fontWeight="bold">{typeId}</tspan>
            <tspan x={x} dy="1.2em">{typeName}</tspan>
        </text>
    );
};

const TypeCharacter: React.FC<{ typeId: number }> = ({ typeId }) => {
    const characterSize = "w-32 h-32";
    const baseProps = {
        className: `${characterSize} text-white`,
        viewBox: "0 0 100 100",
        fill: "currentColor"
    };

    const characters: { [key: number]: React.ReactNode } = {
        1: ( // 完璧主義者: きちっとしたロボット
            <svg {...baseProps}><rect x="25" y="20" width="50" height="60" rx="5" stroke="white" strokeWidth="2" fillOpacity="0.8" /><circle cx="38" cy="35" r="4" /><circle cx="62" cy="35" r="4" /><rect x="35" y="55" width="30" height="5" rx="2" /><path d="M30 80 L35 90 M70 80 L65 90" stroke="white" strokeWidth="2" /><path d="M25 40 L15 50 M75 40 L85 50" stroke="white" strokeWidth="2" /></svg>
        ),
        2: ( // 助ける人: ハートを抱えるキャラクター
            <svg {...baseProps}><circle cx="50" cy="50" r="30" fillOpacity="0.8" /><path d="M50 35 C 40 25, 25 35, 50 60 C 75 35, 60 25, 50 35 Z" fill="white" /><circle cx="42" cy="48" r="3" fill="black" /><circle cx="58" cy="48" r="3" fill="black" /><path d="M45,60 A 5 5 0 0 0 55 60" fill="none" stroke="black" strokeWidth="1.5" /></svg>
        ),
        3: ( // 達成する人: 星を持つヒーロー
            <svg {...baseProps}><path d="M50 10 L61 35 L88 35 L68 53 L76 78 L50 63 L24 78 L32 53 L12 35 L39 35 Z" stroke="white" strokeWidth="2" fillOpacity="0.8" /><circle cx="50" cy="50" r="10" fill="white" /><path d="M45 52 C 50 58, 55 52, 45 52" fill="black" /></svg>
        ),
        4: ( // 個性的な人: 芸術的なパレット
            <svg {...baseProps}><path d="M50 10 C 90 10, 90 90, 50 90 C 10 90, 10 10, 50 10 Z" fillOpacity="0.8" /><circle cx="35" cy="35" r="8" fill="#FF6B6B" /><circle cx="65" cy="35" r="8" fill="#4ECDC4" /><circle cx="50" cy="65" r="8" fill="#FFE66D" /><path d="M20 70 Q 50 80, 80 70" stroke="white" strokeWidth="2" /></svg>
        ),
        5: ( // 調べる人: 電球のアイデア
            <svg {...baseProps}><path d="M50 15 C 35 15, 25 30, 25 45 C 25 65, 45 70, 50 85 C 55 70, 75 65, 75 45 C 75 30, 65 15, 50 15 Z" fillOpacity="0.8" /><rect x="40" y="80" width="20" height="5" /><path d="M45 50 L 55 50 M 50 45 L 50 55 M 47 47 L 53 53 M 47 53 L 53 47" stroke="white" strokeWidth="2.5" /></svg>
        ),
        6: ( // 忠実な人: 盾
            <svg {...baseProps}><path d="M50 10 L90 30 L90 70 L50 90 L10 70 L10 30 Z" fillOpacity="0.8" /><path d="M50 20 L80 40 L80 60 L50 80 L20 60 L20 40 Z" stroke="white" strokeWidth="2" fill="none" /><path d="M50 40 L50 70" stroke="white" strokeWidth="2" /></svg>
        ),
        7: ( // 熱中する人: 飛び跳ねるキャラクター
            <svg {...baseProps}><circle cx="50" cy="60" r="25" fillOpacity="0.8" /><path d="M30 15 L 35 25 M 70 15 L 65 25 M 50 5 L 50 20" stroke="white" strokeWidth="2" /><circle cx="42" cy="58" r="3" fill="black" /><circle cx="58"cy="58" r="3" fill="black"/><path d="M45,70 Q 50 75, 55 70" fill="none" stroke="black" strokeWidth="1.5"/></svg>
        ),
        8: ( // 挑戦する人: 力強い拳
            <svg {...baseProps}><path d="M30 80 L 30 50 C 30 30, 50 30, 50 40 L 70 40 C 80 40, 80 50, 70 50 L 70 80 Z" stroke="white" strokeWidth="2" fillOpacity="0.8"/><rect x="30" y="20" width="10" height="20" rx="3"/><rect x="45" y="20" width="10" height="20" rx="3"/><rect x="60" y="20" width="10" height="20" rx="3"/></svg>
        ),
        9: ( // 平和をもたらす人: 穏やかな雲
            <svg {...baseProps}><path d="M20 70 C 5 70, 5 50, 25 50 C 30 30, 70 30, 75 50 C 95 50, 95 70, 80 70 Z" fillOpacity="0.8" /><circle cx="35" cy="60" r="3" fill="white" /><circle cx="65" cy="60" r="3" fill="white" /><path d="M45,65 A 5 5 0 0 0 55 65" fill="none" stroke="white" strokeWidth="1.5" /></svg>
        )
    };
    
    return (
        <div className="flex justify-center items-center my-4">
             {characters[typeId] || null}
        </div>
    );
};


const Results: React.FC<ResultsProps> = ({ scores, onRestart }) => {
    const chartData = useMemo(() => {
        return ENNEAGRAM_TYPES.map(type => ({
            subject: `T${type.id} ${type.name}`,
            score: scores[`type${type.id}`] || 0,
            fullMark: 28, // 7 questions * 4 points max
        }));
    }, [scores]);

    const primaryType = useMemo(() => {
        if (Object.keys(scores).length === 0) return null;
        const primaryTypeId = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
        const typeIdNum = parseInt(primaryTypeId.replace('type', ''));
        return ENNEAGRAM_TYPES.find(t => t.id === typeIdNum);
    }, [scores]);

    if (!primaryType) {
        return (
             <div className="text-center">
                <p className="text-red-500">エラー: 診断結果を判定できませんでした。</p>
                 <button onClick={onRestart} className="mt-4 bg-indigo-600 text-white font-bold py-2 px-4 rounded-full hover:bg-indigo-700 transition">もう一度診断する</button>
            </div>
        );
    }
    
    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold">あなたの診断結果</h2>
                <TypeCharacter typeId={primaryType.id} />
                <p className="text-4xl font-bold mt-2">タイプ {primaryType.id}: {primaryType.name}</p>
                <p className="mt-1 text-indigo-200">({primaryType.keywords})</p>
            </div>

            <div className="p-6 bg-white/70 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold text-slate-800 mb-4 text-center">性格スコアバランス</h3>
                <div style={{ width: '100%', height: 450 }}>
                    <ResponsiveContainer>
                        <RadarChart cx="50%" cy="50%" outerRadius="48%" data={chartData}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" tick={<CustomAngleAxisTick />} />
                            <PolarRadiusAxis angle={30} domain={[0, 28]} tick={{ fill: 'transparent' }} />
                            <Radar name="あなたのスコア" dataKey="score" stroke="#4f46e5" fill="#6366f1" fillOpacity={0.6} />
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', border: '1px solid #ddd', borderRadius: '10px' }} />
                            <Legend />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
                <a
                    href={RESULT_URLS[primaryType.id]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto text-center bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-4 px-10 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out text-lg"
                >
                    診断結果を見る
                </a>
                <button
                    onClick={onRestart}
                    className="w-full sm:w-auto bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-4 px-10 rounded-full shadow transform hover:scale-105 transition-transform duration-300 ease-in-out text-lg"
                >
                    もう一度診断する
                </button>
            </div>
        </div>
    );
};

export default Results;
