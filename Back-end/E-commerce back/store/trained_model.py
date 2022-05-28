import joblib
md = joblib.load('../matx.joblib')

import sklearn
from sklearn.decomposition import TruncatedSVD

class RecommendationList:

  def Recom(i):
    SVD = TruncatedSVD(n_components=10)
    decomposed_matrix = SVD.fit_transform(md)
    decomposed_matrix.shape

    import numpy as np
    correlation_matrix = np.corrcoef(decomposed_matrix)
    correlation_matrix.shape
    product_names = list(md.index)
    product_ID = product_names.index(i)

    correlation_product_ID = correlation_matrix[product_ID]
    correlation_product_ID.shape
    Recommend = list(md.index[correlation_product_ID < 1])

    # Removes the item already bought by the customer
    # lst = []
    # for i in lst:
    #   print(i)
    #   lst.remove(i)
    for i in Recommend:
      Recommend.remove(i) 
    return Recommend[4:10]