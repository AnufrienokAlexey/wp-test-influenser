<?php namespace Wc1c\Wc\Products;

defined('ABSPATH') || exit;

use WC_Product_Simple;
use Wc1c\Wc\Contracts\ProductContract;
use Wc1c\Wc\Traits\Cases;
use Wc1c\Wc\Products\Traits\SchemaProductTrait;
use Wc1c\Wc\Products\Traits\ConfigurationProductTrait;
use Wc1c\Wc\Products\Traits\ExternalProductTrait;
use Wc1c\Wc\Products\Traits\SkuProductTrait;
use Wc1c\Wc\Products\Traits\TypeProductTrait;
use Wc1c\Wc\Products\Traits\SaveProductTrait;

/**
 * SimpleProduct
 *
 * @package Wc1c\Wc
 */
class SimpleProduct extends WC_Product_Simple implements ProductContract
{
	use Cases;
	use SchemaProductTrait;
	use ExternalProductTrait;
	use ConfigurationProductTrait;
	use SkuProductTrait;
	use TypeProductTrait;
	use SaveProductTrait;

	/**
	 * Получение идентификатора продукта
	 *
	 * @return int
	 */
	public function getId()
	{
		return $this->get_id();
	}
}