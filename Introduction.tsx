import React, { useState } from 'react';

interface IntroductionProps {
  onStart: () => void;
}

const GuideSection: React.FC<{ title: string, number: number, children: React.ReactNode }> = ({ title, number, children }) => (
    <div className="mb-6 p-6 bg-white/50 rounded-lg shadow-md border border-slate-200">
        <h2 className="text-2xl font-bold text-indigo-700 mb-3">
            <span className="bg-indigo-700 text-white rounded-full w-8 h-8 inline-flex items-center justify-center mr-3">{number}</span>
            {title}
        </h2>
        <div className="space-y-3 text-slate-700 leading-relaxed">{children}</div>
    </div>
);

const guides = [
    {
        number: 1,
        title: "エニアグラムとは？",
        content: <>
            <p>人間の性格を「動機」に基づいて9つのタイプに分類し、自己理解や他者との良好な関係構築、そして人格的な成長を促すことを目的とした性格類型論です。9つの点で構成される幾何学図形をシンボルとして用いるのが特徴で、ビジネスでは人材育成やチームマネジメント、個人の適性分析などに広く活用されています。</p>
            <div className="mt-4 p-4 bg-indigo-50 border-l-4 border-indigo-500 text-indigo-800 rounded-r-lg">
                <h3 className="font-bold">主な特徴</h3>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li><span className="font-semibold">9つのタイプ：</span>性格を9つの主要なパターンに分類します。</li>
                    <li><span className="font-semibold">根源的な動機：</span>表面的な行動だけでなく、その背景にある無意識的な動機や恐れに焦点を当てます。</li>
                    <li><span className="font-semibold">成長とストレスの方向：</span>診断したタイプは固定されたものではなく、ダイナミックな性格の変化を捉えることができます。</li>
                    <li><span className="font-semibold">古代の叡智と現代心理学：</span>起源は古代にさかのぼり、20世紀に現代的な心理学的アプローチが取り入れられ発展しました。</li>
                </ul>
            </div>
        </>,
    },
    {
        number: 2,
        title: "診断の前に（必ずお読みください）",
        content: <>
            <p>質問に回答する際はプライベートでの自然体の状態での場合を考えて回答をしてください。より正確な診断のために、以下の点にご注意ください。</p>
            <ul className="list-none space-y-2 mt-4 text-sm">
                <li className="flex items-start"><span className="text-purple-600 font-bold mr-2">✓</span><div><strong className="text-purple-700">願望で選ばない：</strong>「理想だから／そうなりたいから」ではなく、これまで実際どれくらい起きたかで選んでください。</div></li>
                <li className="flex items-start"><span className="text-purple-600 font-bold mr-2">✓</span><div><strong className="text-purple-700">役割で選ばない：</strong>役割上の“ねばならない”は外し、普段の自分で答えてください。</div></li>
                <li className="flex items-start"><span className="text-purple-600 font-bold mr-2">✓</span><div><strong className="text-purple-700">善悪で選ばない：</strong>世間的な基準ではなく、自分の実際のパターンを優先してください。タイプに優劣はありません。</div></li>
                <li className="flex items-start"><span className="text-purple-600 font-bold mr-2">✓</span><div><strong className="text-purple-700">答える“時期”は直近3〜5年に固定：</strong>過去と現在を混ぜず、最近のあなたで答えてください。</div></li>
                <li className="flex items-start"><span className="text-purple-600 font-bold mr-2">✓</span><div><strong className="text-purple-700">迷ったら「より多かったほう」：</strong>回答は“頻度”で選びます。悩んだら、過去に多かったほうを選んでください。</div></li>
            </ul>
        </>,
    },
    {
        number: 3,
        title: "回答の選択肢について",
        content: <>
            <p>各質問に対して、以下の4つの選択肢から最も当てはまるものを選んでください。</p>
            <ul className="list-none space-y-2 mt-4">
                <li>ほぼいつもそうだった（10回中8～10回）</li>
                <li>わりとそうだった（10回中5～7回）</li>
                <li>たまにはそうだった（10回中2～4回）</li>
                <li>ほとんどなかった（10回中0～1回）</li>
            </ul>
            <p className="mt-4 font-semibold text-slate-600">エニアグラムは“当てはめ”ではなく自己理解と成長のための地図です。落ち着いて、リアルな自分でお答えください。</p>
        </>,
    },
];

const Introduction: React.FC<IntroductionProps> = ({ onStart }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = () => {
        if (currentStep < guides.length - 1) {
            setCurrentStep(step => step + 1);
        } else {
            onStart();
        }
    };
    
    const currentGuide = guides[currentStep];
    const isLastStep = currentStep === guides.length - 1;

    return (
        <div className="animate-fade-in">
            <div key={currentStep} className="animate-fade-in">
                <GuideSection title={currentGuide.title} number={currentGuide.number}>
                    {currentGuide.content}
                </GuideSection>
            </div>

            <div className="text-center mt-8">
                <button
                    onClick={handleNext}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-12 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out text-xl"
                >
                    {isLastStep ? '診断をスタートする' : '次へ'}
                </button>
            </div>
        </div>
    );
};

export default Introduction;
