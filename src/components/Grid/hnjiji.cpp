#include <bits/stdc++.h>

using namespace std;

int main() {
    int t;
    cin >> t;
    while (t--) {
        long long h, n;
        cin >> h >> n;
        vector<long long> a(n);
        for (long long i = 0; i < n; i++) cin >> a[i];
        vector<long long> c(n);
        for (long long i = 0; i < n; i++) cin >> c[i];

        long long sum = 0;
        for (long long i = 0; i < n; i++) {
            sum += a[i];
        }

        if (sum >= h) {
            cout << 1 << endl;
            continue;
        }

        long long left = 1, right = 1e18; // Adjust the right bound as needed
        long long answer = right;

        while (left <= right) {
            long long mid = (left + right) / 2;
            long long total = 0;
            for (long long i = 0; i < n; i++) {
                total += a[i] * (mid / c[i]);
                if (total >= h) break; // Early exit if total damage exceeds h
            }

            if (total >= h) {
                answer = mid;
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }

        cout << answer << endl;
    }
    return 0;
}