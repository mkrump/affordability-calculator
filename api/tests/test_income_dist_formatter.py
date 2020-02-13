from resources.income_dist_formatter import format_response


class MSAIncomeSummary:
    def __init__(self, msa, total_household_population, median_income, mean_income):
        self.msa = msa
        self.total_household_population = total_household_population
        self.median_income = median_income
        self.mean_income = mean_income


def test_construct_from_response():
    census_api_response = [
        ["NAME", "S1901_C01_001E", "S1901_C01_002E", "S1901_C01_003E", "S1901_C01_004E",
         "S1901_C01_005E", "S1901_C01_006E", "S1901_C01_007E", "S1901_C01_008E", "S1901_C01_009E",
         "S1901_C01_010E", "S1901_C01_011E", "S1901_C01_012E", "S1901_C01_013E",
         "metropolitan statistical area/micropolitan statistical area"],
        ["Fort Collins, CO Metro Area", "139382", "4.7", "2.9", "7.4", "6.8", "11.4", "19.6",
         "13.2", "18.8", "8.1", "7.2", "71091", "92688", "22660"]
    ]
    expected = {
        "msa_name": "Fort Collins, CO Metro Area",
        "total_households": 139382,
        "income_distribution": {
            "under_10": {"high": 10000, "label": "<10,000", "low": 0, "percent": 4.7},
            "10_15": {"high": 14999, "label": "10,000-14,999", "low": 10001, "percent": 2.9},
            "15_25": {"high": 24999, "label": "15,000-24,999", "low": 15000, "percent": 7.4},
            "25_35": {"high": 34999, "label": "25,000-34,999", "low": 25000, "percent": 6.8},
            "35_50": {"high": 49999, "label": "35,000-49,999", "low": 35000, "percent": 11.4},
            "50_75": {"high": 74999, "label": "50,000-74,999", "low": 50000, "percent": 19.6},
            "75_100": {"high": 99999, "label": "75,000-99,999", "low": 75000, "percent": 13.2},
            "100_150": {"high": 149999, "label": "100,000-149,999", "low": 100000, "percent": 18.8},
            "150_200": {"high": 199999, "label": "150,000-199,999", "low": 150000, "percent": 8.1},
            "200_plus": {"high": 1000000, "label": "200,000+", "low": 200000, "percent": 7.2},
        },
        "median_income": 71091,
        "mean_income": 92688,
        "msa_number": "22660"
    }
    assert format_response(census_api_response) == expected
