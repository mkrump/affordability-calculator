import logging

from fastapi import HTTPException, Path
from requests import Request, Session

from .income_dist_formatter import format_response
from fastapi import APIRouter

from config import settings

router = APIRouter()


@router.get("/income-dist/{msa}", tags=["income-dist"])
async def income_dist(msa: int = Path(..., title="A valid MSA id")):
    url = "https://api.census.gov/data/2018/acs/acs1/subject"
    # "INCOME IN THE PAST 12 MONTHS (IN 2018 INFLATION-ADJUSTED DOLLARS)"
    census_variables = [
        "NAME",
        "S1901_C01_001E",  # Estimate!!Households!!Total
        "S1901_C01_002E",  # Estimate!!Households!!Total!!Less than $10,000
        "S1901_C01_003E",  # Estimate!!Households!!Total!!$10,000 to $14,999
        "S1901_C01_004E",  # Estimate!!Households!!Total!!$15,000 to $24,999
        "S1901_C01_005E",  # Estimate!!Households!!Total!!$25,000 to $34,999
        "S1901_C01_006E",  # Estimate!!Households!!Total!!$35,000 to $49,999
        "S1901_C01_007E",  # Estimate!!Households!!Total!!$50,000 to $74,999
        "S1901_C01_008E",  # Estimate!!Households!!Total!!$75,000 to $99,999
        "S1901_C01_009E",  # Estimate!!Households!!Total!!$100,000 to $149,999
        "S1901_C01_010E",  # Estimate!!Households!!Total!!$150,000 to $199,999
        "S1901_C01_011E",  # Estimate!!Households!!Total!!$200,000 or more
        "S1901_C01_012E",  # Estimate!!Households!!Median income (dollars)
        "S1901_C01_013E",  # Estimate!!Households!!Mean income (dollars)
    ]
    querystring = {"key": settings.census_api_key,
                   "for": f"metropolitan statistical area/micropolitan statistical area:{msa}",
                   "get": ",".join(census_variables),
                   }
    session = Session()
    request = Request('GET', url, params=querystring).prepare()
    logging.info(request.url)
    response = session.send(request)
    if response.status_code == 204:
        raise HTTPException(status_code=404, detail="Invalid MSA. MSA {} Not found".format(msa))
    data = response.json()
    f_data = format_response(data)
    return f_data
