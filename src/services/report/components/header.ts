export function generateHeader(groupName: string): string {
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return `
    <div class="content" style="
        background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
        height: 100%;
        color: white;
        position: relative;
        overflow: hidden;
    ">
        <!-- Background Pattern -->
        <div style="
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0);
            background-size: 40px 40px;
            opacity: 0.5;
        "></div>

        <!-- Content Container -->
        <div style="position: relative; height: 100%; display: flex; flex-direction: column;">
            <!-- Top Section -->
            <div style="padding: 48px 0;">
                <div style="display: flex; align-items: center; margin-bottom: 32px;">
                    <div style="
                        width: 64px;
                        height: 64px;
                        background: white;
                        border-radius: 16px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-right: 24px;
                    ">
                        <svg style="width: 32px; height: 32px; color: #1e40af;" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm0-8a2 2 0 100 4 2 2 0 000-4z"/>
                        </svg>
                    </div>
                    <div>
                        <h1 style="font-size: 40px; font-weight: 700; margin: 0; line-height: 1.2;">Security Analysis Report</h1>
                        <p style="font-size: 20px; opacity: 0.9; margin: 8px 0 0;">Comprehensive Security Assessment</p>
                    </div>
                </div>
            </div>

            <!-- Center Content -->
            <div style="flex-grow: 1; display: flex; align-items: center; justify-content: center; padding: 48px 0;">
                <div style="text-align: center;">
                    <div style="
                        display: inline-block;
                        padding: 16px 32px;
                        background: rgba(255,255,255,0.1);
                        backdrop-filter: blur(10px);
                        border-radius: 12px;
                        border: 1px solid rgba(255,255,255,0.2);
                        margin-bottom: 48px;
                    ">
                        <h2 style="font-size: 32px; font-weight: 500; margin: 0;">${groupName}</h2>
                    </div>

                    <div style="
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 32px;
                        max-width: 800px;
                        margin: 0 auto;
                    ">
                        <div style="
                            background: rgba(255,255,255,0.1);
                            backdrop-filter: blur(10px);
                            border-radius: 16px;
                            border: 1px solid rgba(255,255,255,0.2);
                            padding: 24px;
                            text-align: center;
                        ">
                            <div style="
                                width: 48px;
                                height: 48px;
                                background: rgba(255,255,255,0.2);
                                border-radius: 12px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                margin: 0 auto 16px;
                            ">
                                <svg style="width: 24px; height: 24px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                                </svg>
                            </div>
                            <h3 style="font-size: 18px; font-weight: 500; margin-bottom: 8px;">Threat Analysis</h3>
                            <p style="font-size: 14px; opacity: 0.8;">Comprehensive security assessment and risk evaluation</p>
                        </div>

                        <div style="
                            background: rgba(255,255,255,0.1);
                            backdrop-filter: blur(10px);
                            border-radius: 16px;
                            border: 1px solid rgba(255,255,255,0.2);
                            padding: 24px;
                            text-align: center;
                        ">
                            <div style="
                                width: 48px;
                                height: 48px;
                                background: rgba(255,255,255,0.2);
                                border-radius: 12px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                margin: 0 auto 16px;
                            ">
                                <svg style="width: 24px; height: 24px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                </svg>
                            </div>
                            <h3 style="font-size: 18px; font-weight: 500; margin-bottom: 8px;">Impact Analysis</h3>
                            <p style="font-size: 14px; opacity: 0.8;">Detailed evaluation of security incidents and vulnerabilities</p>
                        </div>

                        <div style="
                            background: rgba(255,255,255,0.1);
                            backdrop-filter: blur(10px);
                            border-radius: 16px;
                            border: 1px solid rgba(255,255,255,0.2);
                            padding: 24px;
                            text-align: center;
                        ">
                            <div style="
                                width: 48px;
                                height: 48px;
                                background: rgba(255,255,255,0.2);
                                border-radius: 12px;
                                display: flex;
                                align-items: center;
                                justify-center: center;
                                margin: 0 auto 16px;
                            ">
                                <svg style="width: 24px; height: 24px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                                </svg>
                            </div>
                            <h3 style="font-size: 18px; font-weight: 500; margin-bottom: 8px;">Recommendations</h3>
                            <p style="font-size: 14px; opacity: 0.8;">Actionable insights and security improvement strategies</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div style="padding: 48px 0;">
                <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    opacity: 0.9;
                ">
                    <div>
                        <p style="font-size: 14px; font-weight: 500; margin-bottom: 4px;">Generated on</p>
                        <p style="font-size: 24px; font-weight: 300;">${currentDate}</p>
                    </div>
                    <div style="text-align: right;">
                        <p style="font-size: 14px; font-weight: 500; margin-bottom: 4px;">Powered by</p>
                        <p style="font-size: 24px; font-weight: 300;">Sensex Analytics</p>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}
