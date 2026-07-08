#include <bits/stdc++.h>

using namespace std;

vector<vector<int>> dp; // Declare dp globally

int helper(int i, int j, string &a, string &b, string &c) {
    if (i == a.size() && j == b.size()) return 0;
    if (dp[i][j] != -1) return dp[i][j];

    int pos = i + j;
    int res = 1e9;

    if (i < a.size()) {
        int cost = helper(i + 1, j, a, b, c) + (a[i] != c[pos]);
        res = min(res, cost);
    }
    if (j < b.size()) {
        int cost = helper(i, j + 1, a, b, c) + (b[j] != c[pos]);
        res = min(res, cost);
    }

    return dp[i][j] = res;
}

int main() {
    int t;
    cin >> t;
    while (t--) {
        string a, b, c;
        cin >> a >> b >> c;
        int n = a.size();
        int m = b.size();
        
        dp.assign(n + 1, vector<int>(m + 1, -1)); // Initialize dp inside each test case
        cout << helper(0, 0, a, b, c) << endl;
    }

    return 0;
}
