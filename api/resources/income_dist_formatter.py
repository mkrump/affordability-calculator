DATADICTIONARY = {
    'NAME': {"msa_name": {'label': 'name'}},
    'S1901_C01_001E': {"total_households": {'label': "total households"}},
    'S1901_C01_002E': {"under_10": {'label': "<10,000", 'low': 0, 'high': 10000}},
    'S1901_C01_003E': {"10_15": {'label': "10,000-14,999", 'low': 10001, 'high': 14999}},
    'S1901_C01_004E': {"15_25": {'label': "15,000-24,999", 'low': 15000, 'high': 24999}},
    'S1901_C01_005E': {"25_35": {'label': "25,000-34,999", 'low': 25000, 'high': 34999}},
    'S1901_C01_006E': {"35_50": {'label': "35,000-49,999", 'low': 35000, 'high': 49999}},
    'S1901_C01_007E': {"50_75": {'label': "50,000-74,999", 'low': 50000, 'high': 74999}},
    'S1901_C01_008E': {"75_100": {'label': "75,000-99,999", 'low': 75000, 'high': 99999}},
    'S1901_C01_009E': {"100_150": {'label': "100,000-149,999", 'low': 100000, 'high': 149999}},
    'S1901_C01_010E': {"150_200": {'label': "150,000-199,999", 'low': 150000, 'high': 199999}},
    'S1901_C01_011E': {"200_plus": {'label': "200,000+", 'low': 200000, 'high': 1000000}},
    'S1901_C01_012E': {"median_income": {'label': "median income"}},
    'S1901_C01_013E': {"mean_income": {'label': "mean income"}},
    'metropolitan statistical area/micropolitan statistical area': {"msa_number": {'label': "MSA"}}
}


def format_response(census_data):
    formatted_response = {"income_distribution": {}}
    for key, value in zip(census_data[0], census_data[1]):
        if key not in DATADICTIONARY:
            continue
        new_key = next(iter(DATADICTIONARY[key]))
        if 'low' in DATADICTIONARY[key][new_key]:
            formatted_response["income_distribution"][new_key] = DATADICTIONARY[key][new_key]
            formatted_response["income_distribution"][new_key]["percent"] = float(value)
        else:
            formatted_response[new_key] = value
            if new_key != "msa_number":
                try:
                    formatted_response[new_key] = int(value)
                except ValueError:
                    pass
    return formatted_response

