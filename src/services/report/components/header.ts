export function generateHeader(groupName: string): string {
    return `
    <div class="w-full h-[297mm] flex flex-col">
        <header class="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-12">
            <div class="max-w-4xl mx-auto">
                <h1 class="text-4xl font-bold mb-4">Security Analysis Report</h1>
                <h2 class="text-2xl mb-6">${groupName}</h2>
                <div class="flex justify-between items-center text-sm">
                    <p>Generated on ${new Date().toLocaleString()}</p>
                    <p>Powered by Sensex Analytics</p>
                </div>
            </div>
        </header>

        <div class="flex-grow flex items-center justify-center p-12 bg-gray-50">
            <div class="text-center">
                <img src="/logo.svg" alt="Logo" class="w-32 h-32 mx-auto mb-8" />
                <p class="text-xl text-gray-600 mb-4">Comprehensive Security Analysis</p>
                <p class="text-gray-500">This report provides detailed insights into your security posture,</p>
                <p class="text-gray-500">including alerts, vulnerabilities, and MITRE ATT&CK coverage.</p>
            </div>
        </div>

        <footer class="bg-gray-100 p-4 text-center text-gray-600">
            <p>Confidential - For Internal Use Only</p>
        </footer>
    </div>
    <div class="page-break"></div>`;
}
